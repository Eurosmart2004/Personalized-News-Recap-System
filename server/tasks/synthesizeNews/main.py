from .tools.cluster import cluster
from datetime import datetime
from utils.chain import SynthesizeModel, NameTitleModel
from langchain_text_splitters import RecursiveCharacterTextSplitter
from models import NewsCluster
from database.database import db
import time
from dotenv import load_dotenv
import logging
import os
load_dotenv()
env = os.getenv('FLASK_ENV', 'development')
ollama_server = None
if env == 'production':
    ollama_server = os.getenv('OLLAMA_URL')
else:
    ollama_server = "http://localhost:11434"

def synthesize_news_worker(duration: str):
    now = datetime.now()
    news_list = cluster(now, duration)
    logging.info(f"There are {len(news_list)} clusters")
    synthesize_chain = SynthesizeModel(baseURL=f"{ollama_server}/api/chat", num_ctx=4096)
    name_title_chain = NameTitleModel(baseURL=f"{ollama_server}/api/chat")
    new_synthesize_list: list[NewsCluster] = []
    max_retries = 3

    for label in news_list:
        content, titles = aggregate_news_content(news_list[label])
        logging.info(f"Synthesizing paper for list title: {titles}")

        new_content, new_title = synthesize_with_retries(synthesize_chain, name_title_chain, content, titles, max_retries)
        if new_content and new_title:
            new_synthesize_list.append(
                NewsCluster(title=new_title, content=new_content, type=duration)
            )
        else:
            new_content, new_title = synthesize_in_chunks(synthesize_chain, name_title_chain, content, titles, max_retries)
            if new_content and new_title:
                new_synthesize_list.append(
                    NewsCluster(title=new_title, content=new_content, type=duration)
                )

    db.session.add_all(new_synthesize_list)
    db.session.commit()

    return "Synthesized news successfully"

def aggregate_news_content(news_items):
    content = ""
    titles = ""
    for new in news_items:
        if 'summary' in new and 'title' in new:
            content += new['summary'] + "\n\n"
            titles += new['title'] + "\n\n"
        else:
            logging.warning(f"Missing 'summary' or 'title' in news item: {new}")
    return content, titles

def synthesize_with_retries(synthesize_chain: SynthesizeModel, name_title_chain: NameTitleModel, content, titles, max_retries):
    attempt = 0
    while attempt < max_retries:
        try:
            new_content = synthesize_chain.invoke({"content": content})
            new_title = name_title_chain.invoke({"content": new_content}).replace('"', '')
            return new_content, new_title
        except Exception as e:
            attempt += 1
            logging.warning(f"Attempt {attempt} | Failed to synthesize FULL paper for list title {titles} length {len(content)}. Retrying after 10 seconds")
            logging.warning(str(e))
            time.sleep(10)
    logging.error(f"Failed to synthesize paper for list title {titles} after {max_retries} attempts")
    return None, None

def synthesize_in_chunks(synthesize_chain: SynthesizeModel, name_title_chain: NameTitleModel, content, titles, max_retries):
    method = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=256)
    chunks = method.split_text(content)
    news_content_draft = ""
    for chunk in chunks:
        attempt = 0
        while attempt < max_retries:
            try:
                news_content_draft += synthesize_chain.invoke({"content": chunk})
                break
            except Exception as e:
                attempt += 1
                logging.warning(f"Attempt {attempt} | Failed to synthesize chunk for list title {titles} length {len(chunk)}. Retrying after 10 seconds")
                logging.warning(str(e))
                time.sleep(10)
        else:
            logging.error(f"Failed to synthesize chunk for list title {titles} length {len(chunk)}. Skipping chunk")
    
    try:
        new_title = name_title_chain.invoke({"content": news_content_draft})
        new_content = synthesize_chain.invoke({"content": news_content_draft})
        return new_content, new_title
    except Exception as e:
        logging.error(f"Failed to synthesize final content for list title {titles}")
        logging.error(str(e))
        return None, None