from pymongo import MongoClient
from CrawDag.models import News
import os
from dotenv import load_dotenv
load_dotenv()



def get_db_connection():
    uri = (
        "mongodb://{}:{}@{}:{}?authSource=admin".format(
            os.getenv("MONGO_INITDB_ROOT_USERNAME"), os.getenv("MONGO_INITDB_ROOT_PASSWORD"),
            os.getenv("MONGO_HOST"), os.getenv("MONGO_PORT"),
        )
    )
    client = MongoClient(uri)
    database = client.get_database(os.getenv('MONGO_DATABASE'))
    return database

def save_articles_to_db(news: list[News]) -> list[str]:
    """Save or update news in MongoDB."""
    db = get_db_connection()
    news_collection = db.get_collection('news')
    news_list_id = []
    for new in news:
        existing = news_collection.find_one({'topic': new.topic, 'title': new.title})
        if existing:
            if new.content != existing['content']:
                news_collection.update_one({'_id': existing['_id']}, {'$set': new.to_json()})
                news_list_id.append(str(existing['_id']))
        else:
            result = news_collection.insert_one(new.to_json())
            news_list_id.append(str(result.inserted_id))

    return news_list_id

