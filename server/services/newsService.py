from database.database import db
from models import News, User, UserPreference, Preference, FavoriteNews
from sqlalchemy import and_ 
from datetime import datetime, timezone, timedelta
import urllib.parse
import logging
from pymongo import MongoClient
import requests

async def hanhdle_summarize(article_ids: list[str]) -> str:
    from app import celery
    try:
        task = celery.send_task('summarize', args=[article_ids])
        return task.id
    except Exception as e:
        raise e
    
def get_user_news(user_id: str, before_time: str, after_time: str, limit: int) -> list[dict]:
    try:
        user = User.query.filter_by(id=user_id).first()
        if user is None:
            raise ValueError('User not found')
        
        date_format = '%H:%M:%S %d/%m/%Y (GMT%z)'


        if before_time:
            before_time = before_time.replace("GMT ", "GMT+")
            before_datetime = datetime.strptime(before_time, date_format)
            before_datetime = before_datetime.astimezone(timezone.utc)
        else:
            before_datetime = datetime.now(timezone.utc)

        if after_time:
            after_time = after_time.replace("GMT ", "GMT+")
            after_datetime = datetime.strptime(after_time, date_format)
            after_datetime = after_datetime.astimezone(timezone.utc)
        else:
            after_datetime = datetime.now(timezone.utc)



        # Main query: Join relevant News records to UserPreference based on user_id and limit results
        news_before_query = (
            db.session.query(News)
            .join(UserPreference, UserPreference.user_id == user_id)  # Join UserPreference with User
            .join(Preference, UserPreference.preference_id == Preference.id)  # Join UserPreference with Preference
            .filter(News.topic == Preference.name)  # Match News.topic with Preference.name
            .filter(News.date < before_datetime)  # Apply before date filter
            .order_by(News.date.desc())  # Order by date
            .limit(limit)
        )

        # Query for news after `after_time`
        news_after_query = (
            db.session.query(News)
            .join(UserPreference, UserPreference.user_id == user_id)  # Join UserPreference with User
            .join(Preference, UserPreference.preference_id == Preference.id)  # Join UserPreference with Preference
            .filter(News.topic == Preference.name)  # Match News.topic with Preference.name
            .filter(News.date > after_datetime)  # Apply after date filter
            .order_by(News.date.desc())  # Order by date
            .limit(limit)
        )

        # Execute both queries and combine results
        news_before = news_before_query.all()
        news_after = news_after_query.all()

        # Combine the results and limit the total number of results
        combined_news = news_after + news_before
        combined_news = combined_news[:limit]


        # Convert results to JSON format
        return [news.to_json() for news in combined_news]

    except ValueError as e:
        raise e    

def get_image(image_url: str) -> dict:
    import requests, io
    from app import app
    try:
        response = requests.get(image_url, verify=False)
        image_bytes = io.BytesIO(response.content)
        return image_bytes
    except Exception as e:
        raise e
        
def get_favorite_news(user_id: str) -> list[dict]:
    try:
        favorite_news_query: list[FavoriteNews] = FavoriteNews.query.filter_by(user_id=user_id).all()
        return [f.to_json() for f in favorite_news_query]

    except Exception as e:
        raise e
    
def post_favorite_news(user_id: str, query: str) -> list[dict]:
    try:
        favorite_news = FavoriteNews(user_id=user_id, search=query)
        db.session.add(favorite_news)
        db.session.commit()
        return get_favorite_news(user_id)
    except Exception as e:
        db.session.rollback()
        raise e
    
def put_favorite_news(user_id: str, query_id: str, new_query: str) -> list[dict]:
    try:
        favorite_news_query: FavoriteNews = FavoriteNews.query.filter_by(user_id=user_id, id=query_id).first()
        favorite_news_query.search = new_query
        favorite_news_query.updateAt = datetime.now()
        db.session.commit()
        return get_favorite_news(user_id)
    except Exception as e:
        db.session.rollback()
        raise e
    
def delete_favorite_news(user_id: str, query_id: str) -> list[dict]:
    try:
        favorite_news_query: FavoriteNews = FavoriteNews.query.filter_by(user_id=user_id, id=query_id).first()
        db.session.delete(favorite_news_query)
        db.session.commit()
        return get_favorite_news(user_id)
    except Exception as e:
        db.session.rollback()
        raise e
    
def search_news(userID: str, searchList: str) -> list[dict]:
    from config.app_config import Config

    searchs: list[FavoriteNews] = FavoriteNews.query.filter_by(user_id=userID).all()
    try:
        array_of_results = []
        for search in searchs:
            if search.search not in searchList:
                continue

            response = requests.post(
                    headers={'Authorization': f'Bearer {Config.SERVER_SALVE_BEARER}'},
                    url=f'{Config.SERVER_SLAVE}/api/embedding', 
                    json={'text': search.search})
            query_embedding = response.json()['embedding']

            MONGO_URI = Config.MONGO_URI

            client = MongoClient(MONGO_URI)
            DB_NAME = "personalized-news-recap-system"
            COLLECTION_EMBEDDINGS_NAME = "news_embeddings"
            collection_embeddings = client[DB_NAME][COLLECTION_EMBEDDINGS_NAME]

            seven_days_ago = datetime.now() - timedelta(days=7)
        
            pipeline = [
                {
                    "$vectorSearch": {
                        "index": "query_recommend",
                        "queryVector": query_embedding,
                        "path": "embedding",
                        "exact": True,
                        "limit": 50
                    }
                },
                {
                    "$match": {
                        "date": {"$gte": seven_days_ago},
                    }
                },
                {
                    "$sort": {
                        "date": -1
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "title": 1,
                        "date": 1,
                        "news_id": 1,
                        "score": {
                            "$meta": "vectorSearchScore"
                        }
                    }
                }
            ]

            results = collection_embeddings.aggregate(pipeline)
           
            for doc in results:
                if doc['score'] > 0.7:
                    array_of_results.append({
                        "doc": doc,
                        "search": search.search,
                    })
            
        list_news_favorite = []
        for result in array_of_results:
            news: News = News.query.filter_by(id=result["doc"]['news_id']).first()
            if news:
                list_news_favorite.append({
                    **news.to_json(),
                    "search": result["search"],
                    "score": result["doc"]['score'],
                })

        return list_news_favorite

    except Exception as e:
        logging.error(f'Error creating search record: {e}')