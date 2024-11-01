from langdetect import detect
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from models import News
from database.db import db
from .getNews import get_article_from_ids
from typing import Union
from .language import languages
def clean_content(text: str) -> str:
    """Helper function to clean article content."""
    return text.strip().replace("\n", " ").replace("\t", " ")

def ai_summarize_worker(article_ids: list[str]) -> str:
    model = ChatOpenAI(model="gpt-3.5-turbo")
    parser = StrOutputParser()

    # Define the summarization and check templates
    system_summarize_prompt = """
Viết một đoạn tóm tắt ngắn gọn và hấp dẫn về bài báo đã cho.

# Steps
1. Đọc kỹ bài báo để hiểu sâu nội dung, thông điệp chính và những ý tưởng độc đáo.
2. Xác định yếu tố tạo điểm nhấn (như sự kiện nổi bật, số liệu ấn tượng hoặc thông điệp chính).
3. Tóm tắt bằng văn phong gợi mở, không chỉ nhắc lại nội dung mà khơi gợi sự tò mò, khuyến khích người đọc muốn tìm hiểu thêm.
4. Tránh liệt kê thông tin hay tóm tắt theo trình tự y nguyên của bài báo. Thay vào đó, tập trung vào cảm xúc, thông điệp chính hoặc giá trị bất ngờ từ nội dung.

# Output Format
1. Đoạn văn ngắn 2 đến 3 câu, không bắt đầu bằng cụm từ như "Bài báo nói về" hoặc "Bài báo kể về," mà thay vào đó sử dụng ngôn ngữ sinh động và hấp dẫn.
2. Sử dụng giọng văn tự nhiên, thu hút, và có tính khơi gợi để người đọc tò mò muốn khám phá nội dung bài viết.
3. Đoạn văn phải thể hiện nội dung chính của bài báo một cách cô đọng và hấp dẫn, truyền tải thông điệp hoặc giá trị độc đáo mà bài viết muốn chia sẻ.
4. Đảm bảo sử dụng từ ngữ trang trọng, phù hợp với ngữ cảnh và có tính chất văn viết, tránh những từ địa phương hoặc không phù hợp.

# Notes
Giữ đúng tinh thần và ngôn ngữ của bài báo gốc ({language}), tránh làm mất đi sắc thái nội dung ban đầu.
"""

    # summarize_prompt_template = ChatPromptTemplate.from_template(summarize_template)
    summarize_prompt_template = ChatPromptTemplate.from_messages(
        [
            ("system", system_summarize_prompt),
            ("human", "{content}")
        ]
    )

    # Create the summarization chain
    summarize_chain = summarize_prompt_template | model | parser

    news_list_update: list[News] = [] 
    news_list_add: list[News] = []
    articles = get_article_from_ids(article_ids)

    # Process articles and determine updates or additions
    for article in articles:
        news: Union[News, any] = News.query.filter_by(topic=article['topic'], title=article['title']).first()
        if news:
            if clean_content(news.content) != clean_content(article['content']):
                news.content = clean_content(article['content'])
                news.date = article['date']
                news_list_update.append(news)
        else:
            news = News(
                topic=article['topic'],
                title=article['title'],
                link=article['link'],
                content=article['content'],
                image=article['image'],
                date=article['date'],
            )
            news_list_add.append(news)

    # Prepare inputs for summarization
    input_list = [{'content': news.content, 'language': languages[detect(news.content)]} 
                  for news in (news_list_update + news_list_add)]


    # Hard code check Summary
    # Perform initial summarization
    try:
        initial_summaries = summarize_chain.batch(input_list)
    except Exception as e:
        print(f"Error during summarization: {e}")
        return "Summarization failed"

    # Validate language consistency
    summaries = []
    for i, summary in enumerate(initial_summaries):
        original_language = input_list[i]['language']
        summary_language = languages[detect(summary)]
        length_summary = len(summary.split())

        best_summary = summary
        best_length_summary = length_summary

        # Attempt re-summarization up to 3 times if conditions are not met
        attempts = 0
        max_attempts = 3
        while (summary_language != original_language or length_summary > 120) and attempts < max_attempts:
            if summary_language != original_language:
                print(f"Language mismatch detected. Re-summarizing article {i + 1}.")
            if length_summary > 120:
                print(f"Summary too long detected. Re-summarizing article {i + 1}.")
            print(f"Original language: {original_language}, Summary language: {summary_language}, Summary length: {length_summary}")

            try:
                # Re-summarize the content
                summary = summarize_chain.invoke({
                    "content": input_list[i]['content'],
                    "language": original_language
                })
            except Exception as e:
                print(f"Failed to re-summarize article {i + 1}. Error: {e}")
                break  # Exit loop on exception

            # Update the language and length of the new summary
            summary_language = languages[detect(summary)]
            length_summary = len(summary.split())
            attempts += 1

            # Update the best summary if the new one is better
            if languages[detect(best_summary)] != original_language:
                best_summary = summary
                best_length_summary = length_summary
            elif length_summary < best_length_summary:              
                best_summary = summary
                best_length_summary = length_summary

        # Append the final summary after attempts
        summaries.append(best_summary)

    # Assign summaries to news objects and batch commit to the database
    for i, news in enumerate(news_list_update + news_list_add):
        news.summary = summaries[i]

    try:
        db.session.add_all(news_list_add)
        db.session.commit()
    except Exception as e:
        print(f"Failed to commit changes: {e}")
        db.session.rollback()

    return f"Summarized successfully. Updated: {len(news_list_update)}, Added: {len(news_list_add)}"
