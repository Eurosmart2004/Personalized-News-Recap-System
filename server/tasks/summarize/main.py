import logging
from langdetect import detect, LangDetectException
from langchain_text_splitters import RecursiveCharacterTextSplitter
from models import News
from database.database import db
from .tools.getNews import get_article_from_ids
from .tools.language import LANGUAGES
from .tools.embedding import embedding
# from utils.chain import SummarizeModel
from utils.gemini import SummarizeModel
from typing import Union
from dotenv import load_dotenv
import os
import time

load_dotenv()

def ai_summarize_worker(article_ids: list[str]) -> list[News]:
    logging.info("Starting ai_summarize_worker")
    
    # summarize_chain = SummarizeModel(baseURL=f"{os.getenv('OLLAMA_URL')}/api/chat", num_ctx=4096)
    summarize_chain = SummarizeModel()

    news_list_update: list[News] = [] 
    news_list_add: list[News] = []
    articles = get_article_from_ids(article_ids)

    for article in articles:
        news: Union[News, any] = News.query.filter_by(link=article['link']).first()
        if news:
            if news.content.strip() != article['content'].strip():
                news.content = article['content'].strip()
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

    input_list: list[dict[str, str]] = []
    for news in (news_list_update + news_list_add):
        try:
            language = LANGUAGES[detect(news.content)]
            input_list.append({'content': news.content, 'language': language})
        except LangDetectException:
            logging.warning(f"Could not detect language for content: {news.title}")
            input_list.append({'content': news.content, 'language': 'unknown'})

    summaries = []

    for i, input in enumerate(input_list):
        try:
            summary = summarize_chain.invoke(input)
            if not summary:
                raise ValueError("Received empty response from summarization service")
            if LANGUAGES[detect(summary)] == input['language']:
                summaries.append(summary)
            else:
                logging.warning(f"Summary language: {LANGUAGES[detect(summary)]} does not match input language: {input['language']}")
                summary = summarize_chain.invoke(input)
                summaries.append(summary)
        except Exception as e:
            logging.error(f"Failed to summarize content: {e}")
            time.sleep(60)
            logging.info("Retrying summarization after 60 seconds")
            summary = summarize_chain.invoke(input)
            summaries.append(summary)

        # time.sleep(4)
        logging.info(f"Summarized successfully {i+1}/{len(input_list)}")

    for i, news in enumerate(news_list_update + news_list_add):
        news.summary = summaries[i]

    try:
        db.session.add_all(news_list_add)
        db.session.commit()
    except Exception as e:
        logging.exception("Failed to commit changes")
        db.session.rollback()
        raise e

    for news in news_list_add + news_list_update:
        db.session.refresh(news)

    logging.info(f"Summarized successfully. Updated: {len(news_list_update)}, Added: {len(news_list_add)}")

    if not news_list_add + news_list_update:
        return []
    
    embedding(news_list_add, news_list_update)
    return news_list_add + news_list_update