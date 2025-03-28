from datetime import datetime, timedelta, time
from sqlalchemy import func, text
import pytz
from models import User, News, UserSchedule, Schedule, UserPreference, Preference
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import join
from database.database import db
from jinja2 import Environment, FileSystemLoader
from .tools.sendEmail import send_email
from services import userService
from dotenv import load_dotenv
import random
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

        .filter(News.date >= datetime.now() - timedelta(days=1))  # News from the last 24 hours
        .all()
    )

    # Aggregate news by user
    user_news_map: dict[User, list[News]] = {}
    for user, news in results:
        user_news_map.setdefault(user, []).append(news)

    # Format the date as dd/mm/yyyy
    date = now.strftime('%d/%m/%Y')
    title = f"Your Daily News {date}"

    for user, news_list in user_news_map.items():
        
        # Select random 10 news
        news_list  = random.sample(news_list, 10)

        # Sort news by date (most recent first)
        news_list = sorted(news_list, key=lambda x: x.date, reverse=True)

        # Render the email template with the news
        body = template.render(news_list=[n.to_json() for n in news_list])

        try:
            # Send the email
            send_email(user, title, body)

        except SQLAlchemyError as e:
            # Roll back if any database error occurs
            db.session.rollback()
            print(f"Database error for user {user.email}: {str(e)}")

        except Exception as e:
            print(f"Failed to send email to {user.email}: {str(e)}")

    return 'Send email process completed.'