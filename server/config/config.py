from dotenv import load_dotenv
import os
from celery.schedules import crontab
load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = (
        "mysql://{}:{}@{}:{}/{}".format(
            os.getenv("MYSQL_USER"), os.getenv("MYSQL_ROOT_PASSWORD"),
            os.getenv("MYSQL_HOST"), os.getenv("MYSQL_PORT"),
            os.getenv("MYSQL_DATABASE")
        )
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MONGO_URI = (
        "mongodb://{}:{}@{}:{}/{}?authSource=admin".format(
            os.getenv("MONGO_INITDB_ROOT_USERNAME"), os.getenv("MONGO_INITDB_ROOT_PASSWORD"),
            os.getenv("MONGO_HOST"), os.getenv("MONGO_PORT"),
            os.getenv("MONGO_DATABASE")
        )
    )
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

    broker_url = (
        "amqp://{}:{}@{}:5672".format(
            os.getenv("RABBITMQ_DEFAULT_USER"), os.getenv("RABBITMQ_DEFAULT_PASS"),
            os.getenv("RABBITMQ_HOST")
        )
    )
    result_backend = None
    timezone = 'Asia/Ho_Chi_Minh'
    enable_utc = True
    beat_schedule = {
        # 'send-email': {
        #     'task': 'send_news',
        #     'schedule': crontab(minute='*/1'),
        # },
        # 'synthesize-news-test':{
        #     'task': 'synthesize_news',
        #     'schedule': crontab(minute='*/1'),
        #     'args': ('day',)
        # },
        # 'synthesize-news-day':{
        #     'task': 'synthesize_news',
        #     'schedule': crontab(hour=23, minute=0),
        #     'args': ('day',)
        # },
        # 'synthesize-news-week':{
        #     'task': 'synthesize_news',
        #     'schedule': crontab(day_of_week=0, hour=23, minute=0),
        #     'args': ('week',)
        # },
    }
    task_routes = {
        'send_news': {'queue': 'send_news_queue'},
        'summarize': {'queue': 'summarize_queue'}
    },
    UPLOAD_FOLDER = "uploads"
    CLOUDINARY_URL = os.getenv("CLOUDINARY_URL")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
    CLOUDINARY_NAME = os.getenv("CLOUDINARY_NAME")
    SERVER_SLAVE = os.getenv("SERVER_SLAVE")
    SERVER_SALVE_BEARER = os.getenv("SERVER_SALVE_BEARER")


class DevConfig(Config):
    SQLALCHEMY_DATABASE_URI = (
        "mysql://{}:{}@{}:{}/{}".format(
            os.getenv("MYSQL_USER"), os.getenv("MYSQL_ROOT_PASSWORD"),
            'localhost', 3307,
            os.getenv("MYSQL_DATABASE")
        )
    )
    MONGO_URI = (
        "mongodb://{}:{}@{}:{}/{}?authSource=admin".format(
            os.getenv("MONGO_INITDB_ROOT_USERNAME"), os.getenv("MONGO_INITDB_ROOT_PASSWORD"),
            'localhost', 27018,
            os.getenv("MONGO_DATABASE")
        )
    )
    broker_url = "amqp://{}:{}@localhost:5672".format(
        os.getenv("RABBITMQ_DEFAULT_USER"), os.getenv("RABBITMQ_DEFAULT_PASS")
    )

class ProdConfig(Config):
    SQLALCHEMY_DATABASE_URI = (
        "mysql://{}:{}@{}:{}/{}".format(
            os.getenv("MYSQL_USER"), os.getenv("MYSQL_ROOT_PASSWORD"),
            os.getenv("MYSQL_HOST"), os.getenv("MYSQL_PORT"),
            os.getenv("MYSQL_DATABASE")
        )
    )
    broker_url = (
        "amqps://{}:{}@{}/{}".format(
            os.getenv("RABBITMQ_DEFAULT_USER"), os.getenv("RABBITMQ_DEFAULT_PASS"),
            os.getenv("RABBITMQ_HOST"), os.getenv("RABBITMQ_DEFAULT_USER")
        )
    )
    MONGO_URI = (
        "mongodb+srv://{}:{}@{}/{}?retryWrites=true&w=majority&appName=Cluster0".format(
            os.getenv("MONGO_INITDB_ROOT_USERNAME"), os.getenv("MONGO_INITDB_ROOT_PASSWORD"),
            os.getenv("MONGO_HOST"),
            os.getenv("MONGO_DATABASE")
        )
    )
    