from .summarize.main import ai_summarize_worker
from .sendEmail.main import send_news_worker
from .synthesizeNews.main import synthesize_news_worker
from celery import Celery, Task
import logging
def init(celery: Celery):

    @celery.task(name='summarize', queue='summarize_queue', acks_late=True, bind=True, max_retries=3)
    def summarize(self, article_ids: list[str]):
        try:
            return ai_summarize_worker(article_ids)
        except Exception as e:
            logging.exception("Error in summarize task")
            try:
                self.retry(exc=e, countdown=20)  # Retry after 20 seconds
            except self.MaxRetriesExceededError:
                logging.error("Max retries exceeded for summarize task")
                raise e

    @celery.task(name='send_news', queue='send_news_queue', acks_late=True)
    def send_news():
        try:
            return send_news_worker()
        except Exception as e:
            logging.exception("Error in send_news task")
            raise e
        
    @celery.task(name="synthesize_news", queue="synthesize_news_queue", acks_late=True, bind=True, max_retries=3)
    def synthesize_news(self, duration: str):
        try:
            return synthesize_news_worker(duration)
        except Exception as e:
            logging.exception("Error in systhesize")
            try:
                self.retry(exc=e, countdown=20)
            except self.MaxRetriesExceededError:
                logging.error("Max retries exceeded for synthesize_news task")
                raise e




