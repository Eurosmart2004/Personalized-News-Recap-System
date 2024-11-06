from .summarize.summarize import ai_summarize_worker
from .sendEmail.sendNews import send_news_worker
from celery import Celery, Task
import logging
def init(celery: Celery):

    @celery.task(name='summarize', queue='summarize_queue', acks_late=True)
    def summarize(article_ids: list[str]):
        try:
            return ai_summarize_worker(article_ids)
        except Exception as e:
            logging.exception("Error in summarize task")
            raise e

    @celery.task(name='send_news', queue='send_news_queue', acks_late=True)
    def send_news():
        try:
            return send_news_worker()
        except Exception as e:
            logging.exception("Error in send_news task")
            raise e



