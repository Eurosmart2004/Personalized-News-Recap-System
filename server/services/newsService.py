from database.database import db
from models import News, User, UserPreference, Preference
from sqlalchemy import and_ 
from datetime import datetime, timezone
import urllib.parse
import logging
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
            # before_datetime = before_datetime.astimezone(timezone.utc)
        else:
            before_datetime = datetime.now(timezone.utc)

        if after_time:
            after_time = after_time.replace("GMT ", "GMT+")
            after_datetime = datetime.strptime(after_time, date_format)
            # after_datetime = after_datetime.astimezone(timezone.utc)
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

