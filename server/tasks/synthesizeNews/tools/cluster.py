from datetime import datetime, timedelta
import numpy as np
import logging
import requests
from dotenv import load_dotenv
import os
load_dotenv()
env = os.getenv('FLASK_ENV', 'development')
server_slave = None
if env == 'production':
    server_slave = "http://server-slave:7000"
else:
    server_slave = "http://localhost:7000"

DURATION = {
    "day": timedelta(days=1),
    "week": timedelta(days=7),
    "month": timedelta(days=60),
}

def cluster(now: datetime, duration: str):
    """
    Clusters news articles based on their embeddings within a specified duration.

    Parameters:
    - now (datetime): The current datetime.
    - duration (str): The duration for clustering ("day", "week", or "month").

    Returns:
    - dict: A dictionary where keys are cluster labels and values are lists of news articles.
    """
    from app import mongo, app

    logging.info("-----Cluster-----")
    collection_embeddings = mongo.db.news_embeddings

    start_date = now - DURATION[duration]

    news_list = list(collection_embeddings.find({
        'date': {
            '$gte': start_date,
        }
    }))

    # Extract embeddings and news IDs
    embeddings = [news['embedding'] for news in news_list]
    news_ids = [news['_id'] for news in news_list]
    news_ori_ids = [news['news_id'] for news in news_list]

    logging.info("Start clustering")
    logging.info(f"Number of news: {len(news_list)}")
    # Perform DBSCAN clustering
    response = requests.post(f'{server_slave}/api/cluster', json={'embeddings': embeddings})
    
    labels = response.json()['labels']

    logging.info("Cluster done")

  
    # Create new clusters, excluding cluster -1
    new_clusters = {}
    for label, news_id in zip(labels, news_ids):
        if label == -1:
            continue  # Skip noise points
        if label not in new_clusters:
            new_clusters[label] = []
        
        new_clusters[label].append(
            collection_embeddings.find_one({'_id': news_id})
        )

    return new_clusters