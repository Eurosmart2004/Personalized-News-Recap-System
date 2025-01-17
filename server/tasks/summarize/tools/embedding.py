# Load model directly
from models import News
import requests
import logging
def embedding(news_list: list[News]):
    from app import mongo
    collection_embeddings = mongo.db.news_embeddings


    contents = [news.content for news in news_list]
    news_ids = [news.id for news in news_list]
    titles = [news.title for news in news_list]
    topics = [news.topic for news in news_list]
    links = [news.link for news in news_list]
    images = [news.image for news in news_list]
    dates = [news.date for news in news_list]
    summaries = [news.summary for news in news_list]

    logging.info("Embedding news")
    embeddings = []
    for i, content in enumerate(contents):
        try:
            response = requests.post('http://server-slave:7000/api/embedding', json={'text': content})
            embedding = response.json()['embedding']
            embeddings.append(embedding)
            logging.info(f"Embedded news {titles[i]}")
        except Exception as e:
            logging.exception(f"Error embedding news {news_ids[i]}")
            logging.exception(e)
            continue
    
    news_list_embedded = []
    for i, embedding in enumerate(embeddings):
        n = {
                'news_id': news_ids[i],
                'title': titles[i],
                'date': dates[i],
                'summary': summaries[i],
                'embedding': embedding
            }
        news_list_embedded.append(n)

    collection_embeddings.insert_many(news_list_embedded)
    return news_list_embedded