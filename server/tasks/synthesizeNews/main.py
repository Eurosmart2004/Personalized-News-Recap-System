from .tools.cluster import cluster
from .tools.format import format_content
from datetime import datetime
# from utils.chain import NameTitleModel
from utils.gemini import SynthesizeModel, NameTitleModel
from langchain_text_splitters import RecursiveCharacterTextSplitter
from models import NewsCluster, Cluster
from database.database import db
from dotenv import load_dotenv
import logging
import time
import os

load_dotenv()
# env = os.getenv('FLASK_ENV', 'development')
# ollama_server = None
# if env == 'production':
#     ollama_server = os.getenv('OLLAMA_URL')
# else:
#     ollama_server = "http://localhost:11434"

def synthesize_news_worker(duration: str):
    now = datetime.now()
    news_list = cluster(now, duration)
    valid_clusters_count = 0

    for label in news_list:
        if len(news_list[label]) >= 3:
            valid_clusters_count += 1

    logging.info(f"There are {valid_clusters_count} clusters")

    synthesize_chain = SynthesizeModel()
    name_title_chain = NameTitleModel()


    for label in news_list:
        news_cluster_list: list[NewsCluster] = []
        
        if len(news_list[label]) < 3:
            continue

        content, titles = "", ""
        for new in news_list[label]:
            if 'content' in new and 'title' in new:
                content += new['content'] + "\n\n"
                titles += new['title'] + "\n\n"
            else:
                logging.warning(f"Missing 'summary' or 'title' in news item: {new}")

        logging.info(f"Synthesizing paper for list title: {titles}")

        try:
            new_content = synthesize_chain.invoke({"content": content})
            new_title = name_title_chain.invoke({"content": new_content})
            new_cluster = Cluster(title=new_title, content=new_content, type=duration)
            db.session.add(new_cluster)
            db.session.commit()

            for new in news_list[label]:
                news_cluster = NewsCluster(
                    news_id=new['news_id'],
                    cluster_id=new_cluster.id
                )
                news_cluster_list.append(news_cluster)
            
            db.session.add_all(news_cluster_list)
            db.session.commit()

        except Exception as e:
            logging.error(f"Failed to synthesize paper for list title {titles}")
            logging.error(str(e))
            time.sleep(60)

    return "Synthesized news successfully"