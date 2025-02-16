from .tools.cluster import cluster
from datetime import datetime
from utils.chain import SynthesizeModel, NameTitleModel
from langchain_text_splitters import RecursiveCharacterTextSplitter
from models import NewsCluster
from database.database import db
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

    for label in news_list:
        content, titles = "", ""
        for new in news_list[label]:
            if 'summary' in new and 'title' in new:
                content += new['summary'] + "\n\n"
                titles += new['title'] + "\n\n"
            else:
                logging.warning(f"Missing 'summary' or 'title' in news item: {new}")

        logging.info(f"Synthesizing paper for list title: {titles}")

        try:
            new_content = synthesize_chain.invoke({"content": content})
            new_title = name_title_chain.invoke({"content": new_content}).replace('"', '')
            new_synthesize_list.append(
                NewsCluster(title=new_title, content=new_content, type=duration)
            )
        except Exception as e:
            logging.error(f"Failed to synthesize paper for list title {titles}")
            logging.error(str(e))

    db.session.add_all(new_synthesize_list)
    db.session.commit()

    return "Synthesized news successfully"