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
        'send-email': {
            'task': 'send_news',
            'schedule': crontab(minute='*/1'),
        },
        # 'send-email-test': {
        #     'task': 'send_news',
        #     'schedule': crontab(hour=22, minute=30),
        # },
    }
    task_routes = {
        'send_news': {'queue': 'send_news_queue'},
        'summarize': {'queue': 'summarize_queue'}
    },


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
    pass