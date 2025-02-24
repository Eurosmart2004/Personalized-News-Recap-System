from models import News
import requests
import logging

def embedding(news_list_add: list[News], news_list_update: list[News]):
    from app import mongo
    from config.app_config import Config
    collection_embeddings = mongo.db.news_embeddings

    # Process news_list_add
    contents_add = [news.content for news in news_list_add]
    news_ids_add = [news.id for news in news_list_add]
    titles_add = [news.title for news in news_list_add]
    dates_add = [news.date for news in news_list_add]
    summaries_add = [news.summary for news in news_list_add]

    logging.info("Embedding news for addition")
    embeddings_add = []
    for i, content in enumerate(contents_add):
        try:
            response = requests.post(
                headers={'Authorization': f'Bearer {Config.SERVER_SALVE_BEARER}'},
                url=f'{Config.SERVER_SLAVE}/api/embedding', 
                json={'text': content})
            embedding = response.json()['embedding']
            embeddings_add.append(embedding)
            logging.info(f"Embedded news {titles_add[i]}")
        except Exception as e:
            logging.exception(f"Error embedding news {news_ids_add[i]}")
            logging.exception(e)
            continue

    news_list_embedded_add = []
    for i, embedding in enumerate(embeddings_add):
        n = {
            'news_id': news_ids_add[i],
            'title': titles_add[i],
            'date': dates_add[i],
            'summary': summaries_add[i],
            'embedding': embedding,
            'content': contents_add[i]
        }
        news_list_embedded_add.append(n)

    collection_embeddings.insert_many(news_list_embedded_add)

    # Process news_list_update
    news_ids_update = [news.id for news in news_list_update]
    contents_update = [news.content for news in news_list_update]


    logging.info("Embedding news for update")
    for i, content in enumerate(contents_update):
        try:
            response = requests.post('http://server-slave:7000/api/embedding', json={'text': content})
            embedding = response.json()['embedding']
            collection_embeddings.update_one(
                {'news_id': news_ids_update[i]},
                {'$set': {
                    'embedding': embedding,
                    'content': content
                    }
                }
            )
            logging.info(f"Updated embedding for news {news_ids_update[i]}")
        except Exception as e:
            logging.exception(f"Error updating embedding for news {news_ids_update[i]}")
            logging.exception(e)
            continue
