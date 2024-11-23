from CrawDag.saving.DataLake import DataLake
from CrawDag.models import News
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv
load_dotenv()

class MongoDataLake(DataLake):
    def __init__(self) -> None:
        self.database = self.__connect()
        pass

    def __connect(self):
        uri = (
        "mongodb://{}:{}@{}:{}?authSource=admin".format(
            os.getenv("MONGO_INITDB_ROOT_USERNAME"), os.getenv("MONGO_INITDB_ROOT_PASSWORD"),
            os.getenv("MONGO_HOST"), os.getenv("MONGO_PORT"),
        )
    )
        client = MongoClient(uri)
        database = client.get_database(os.getenv('MONGO_DATABASE'))
        return database

    def save(self, listNews: list[News]) -> list[str]:
        newsCollection = self.database.get_collection('news')
        newsListIds = []
        for new in listNews:
            existing = newsCollection.find_one({'topic': new.topic, 'title': new.title})
            if existing:
                if new.content != existing['content']:
                    newsCollection.update_one({'_id': existing['_id']}, {'$set': new.to_json()})
                    newsListIds.append(str(existing['_id']))
            else:
                result = newsCollection.insert_one(new.to_json())
                newsListIds.append(str(result.inserted_id))

        return newsListIds
    
    def delete(self, listNewsId: list[str]) -> None:
        newsCollection = self.database.get_collection('news')
        for newsId in listNewsId:
            newsCollection.delete_one({'_id': ObjectId(newsId)})