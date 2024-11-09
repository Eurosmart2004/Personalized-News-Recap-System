from datetime import datetime, timedelta, time
from sqlalchemy import func
import pytz
from models import User, News, UserSchedule, Schedule, UserPreference, Preference, UserNews
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import join
from database.db import db
from jinja2 import Environment, FileSystemLoader
from .sendEmail import send_email
from services import userService
from dotenv import load_dotenv
import os

load_dotenv()

# Get the absolute path to the directory of this script
dir_path = os.path.dirname(os.path.realpath(__file__))

# Load the template
env = Environment(loader=FileSystemLoader(dir_path))
template = env.get_template('templates/news.html')


def send_news_worker():
    # Get current time in UTC+7
    now = datetime.now(pytz.timezone('Etc/GMT-7'))
    hour, minute = now.hour, now.minute

    # Find the schedule for the current time
    schedule = (
        db.session.query(Schedule)
        .filter_by(time=time(hour=hour, minute=minute))
        .first()
    )


    # Query users with matching schedules and aggregate their news
    results = (
        db.session.query(User, News)
        .join(UserSchedule, User.id == UserSchedule.user_id)
        .filter(User.role == 'user')
        .filter(User.isConfirmed == True)
        .filter(UserSchedule.schedule_id == schedule.id)  # Users with the current schedule

        .join(UserPreference, User.id == UserPreference.user_id)
        .join(Preference, Preference.id == UserPreference.preference_id)
        .join(News, News.topic == Preference.name)

        .outerjoin(UserNews, (User.id == UserNews.user_id) & (News.id == UserNews.news_id))
        .filter(News.date >= User.createdAt)  # Only news after user registration
        .filter(UserNews.news_id.is_(None))  # Only unsent news
        .all()
    )

    # Aggregate news by user
    user_news_map: dict[User, list[News]] = {}
    for user, news in results:
        user_news_map.setdefault(user, []).append(news)

    # Format the date as dd/mm/yyyy
    date = now.strftime('%d/%m/%Y')
    title = f"Bảng tin buổi {'sáng' if now.hour < 12 else 'tối'} {date}"

    for user, news_list in user_news_map.items():
        # Sort news by date (most recent first)
        news_list = sorted(news_list, key=lambda x: x.date, reverse=True)

        # Render the email template with the news
        body = template.render(news_list=[n.to_json() for n in news_list])

        try:
            # Send the email
            send_email(user, title, body)

            # Track sent news by adding records to UserNews
            for news in news_list:
                user_news_entry = UserNews(user_id=user.id, news_id=news.id)
                db.session.add(user_news_entry)

            # Commit after each successful email
            db.session.commit()
            print(f"Email sent successfully to {user.email}")

        except SQLAlchemyError as e:
            # Roll back if any database error occurs
            db.session.rollback()
            print(f"Database error for user {user.email}: {str(e)}")

        except Exception as e:
            print(f"Failed to send email to {user.email}: {str(e)}")

    return 'Send email process completed.'