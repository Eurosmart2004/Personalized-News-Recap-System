import logging
from langdetect import detect, LangDetectException
from langchain_text_splitters import RecursiveCharacterTextSplitter
from models import News
from database.database import db
from .tools.getNews import get_article_from_ids
from .tools.language import LANGUAGES
from .tools.embedding import embedding
from utils.chain import SummarizeModel
from typing import Union
from dotenv import load_dotenv
import os
import time
import json

load_dotenv()

def ai_summarize_worker(article_ids: list[str]) -> list[News]:
    logging.info("Starting ai_summarize_worker")
    
    summarize_chain = SummarizeModel(baseURL=f"{os.getenv('OLLAMA_URL')}/api/chat", num_ctx=4096)

    news_list_update: list[News] = [] 
    news_list_add: list[News] = []
    articles = get_article_from_ids(article_ids)

    for article in articles:
        news: Union[News, any] = News.query.filter_by(topic=article['topic'], title=article['title']).first()
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
    max_retries = 3

    for i, input in enumerate(input_list):
        summary = get_summary_with_retries(summarize_chain, input, max_retries)
        time.sleep(15)
        summaries.append(summary)

        logging.info(f"Summarized successfully {i+1}/{len(input_list)}")

    for i, news in enumerate(news_list_update + news_list_add):
        news.summary = summaries[i]

    try:
        db.session.add_all(news_list_add)
        db.session.commit()
    except Exception as e:
        logging.exception("Failed to commit changes")
        db.session.rollback()
        return []

    for news in news_list_add + news_list_update:
        db.session.refresh(news)

    logging.info(f"Summarized successfully. Updated: {len(news_list_update)}, Added: {len(news_list_add)}")
    if not news_list_add + news_list_update:
        return []
    news_list_embedded = embedding(news_list_add)
    return news_list_embedded

def get_summary_with_retries(summarize_chain: SummarizeModel, input, max_retries):
    attempts = 0
    while attempts < max_retries:
        try:
            draft_summary = summarize_chain.invoke(input)
            if not draft_summary:
                raise ValueError("Received empty response from summarization service")
            if LANGUAGES[detect(draft_summary)] == input['language']:
                logging.info(f"Summarized successfully")
                return draft_summary
            else:
                attempts -= 1
                raise Exception(f"Summary language: {LANGUAGES[detect(draft_summary)]} does not match input language: {input['language']}")
        except Exception as e:
            attempts += 1
            logging.warning(f"Error during summarization: {e}. Retrying in 10 seconds... (Attempt {attempts}/{max_retries})")
            time.sleep(10)
    return handle_failed_summarization(summarize_chain, input, max_retries)

def handle_failed_summarization(summarize_chain: SummarizeModel, input, max_retries):
    method = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=256)
    content_chunks = method.split_text(input['content'])
    draft_summary = ""
    for chunk in content_chunks:
        attempts = 0
        while attempts < max_retries:
            try:
                draft_summary += summarize_chain.invoke({'content': chunk})
                break
            except Exception as e:
                attempts += 1
                logging.warning(f"Error during summarization: {e}. Retrying in 10 seconds... (Attempt {attempts}/{max_retries})")
                time.sleep(10)
        else:
            draft_summary += chunk

    attempts = 0
    while attempts < max_retries:
        try:
            final_summary = summarize_chain.invoke({'content': draft_summary})
            if LANGUAGES[detect(final_summary)] == input['language']:
                logging.info(f"Summarized successfully")
                return final_summary
            else:
                attempts -= 1
                raise Exception(f"Summary language: {LANGUAGES[detect(final_summary)]} does not match input language: {input['language']}")
        except Exception as e:
            attempts += 1
            logging.warning(f"Error during summarization: {e}. Retrying in 10 seconds... (Attempt {attempts}/{max_retries})")
            time.sleep(10)
    return draft_summary