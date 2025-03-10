from CrawDag.saving.DataLake import DataLake
from CrawDag.models import News
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import logging
class MongoDataLake(DataLake):
    def __init__(self) -> None:
        self.database = self.__connect()
        pass

    def __connect(self):      
        uri = f"mongodb+srv://admin:admin@cluster0.5vezm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        uri = (
        "mongodb+srv://{}:{}@{}/?retryWrites=true&w=majority&appName=Cluster0".format(
            os.getenv("MONGO_INITDB_ROOT_USERNAME"), os.getenv("MONGO_INITDB_ROOT_PASSWORD"),
            os.getenv("MONGO_HOST"),
            )
        )
    
        client = MongoClient(uri, server_api=ServerApi('1'))
        database = client.get_database(os.getenv("MONGO_DATABASE"))
        return database

    def save(self, listNews: list[News]) -> list[str]:
        newsCollection = self.database.get_collection('news')
        newsListIds = []
        for new in listNews:
            existing = newsCollection.find_one({'link': new.link})
            if existing:
                if new.content != existing['content']:
                    newsCollection.update_one({'_id': existing['_id']}, {'$set': new.to_json()})
                    newsListIds.append(str(existing['_id']))
            else:
                result = newsCollection.insert_one(new.to_json())
                newsListIds.append(str(result.inserted_id))

        return newsListIds
    
    def isExist(self, news: News) -> bool:
        newsCollection = self.database.get_collection('news')
        return newsCollection.find_one({'link': news.link}) is not None
    
    def delete(self, listNewsId: list[str]) -> None:
        newsCollection = self.database.get_collection('news')
        for newsId in listNewsId:
            newsCollection.delete_one({'_id': ObjectId(newsId)})