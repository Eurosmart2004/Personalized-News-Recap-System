import requests
from datetime import datetime
from airflow import DAG
from airflow.operators.python import PythonOperator
from CrawDag.models import News
from CrawDag.crawling import CrawlingTask
from CrawDag.scraping import ScrapingTask
from CrawDag.saving import SavingTask
from CrawDag.sending import SendingTask
import pytz


with DAG(
    dag_id = 'CrawDag',
    description = 'Crawling news from multiple sources',
    # start_date = datetime(2025,1,1, 0, 0 ,0, 0, tzinfo=pytz.timezone('Asia/Ho_Chi_Minh')),
    schedule_interval='@monthly',
    start_date = datetime.now(tz=pytz.timezone('Asia/Ho_Chi_Minh')),
    # schedule_interval = '*/30 * * * *'

) as dag:
    crawl_task = PythonOperator(
        task_id = 'crawl_task',
        python_callable = CrawlingTask('crawl_task').execute,
        provide_context = True
    )

    scrape_task = PythonOperator(
        task_id = 'scrape_task',
        python_callable = ScrapingTask('scrape_task').execute,
        provide_context = True
    )

    save_task = PythonOperator(
        task_id = 'save_task',
        python_callable = SavingTask('save_task').execute,
        provide_context = True
    )

    sent_task = PythonOperator(
        task_id = 'sent_task',
        python_callable = SendingTask('sent_task').execute,
        provide_context = True
    )

    # crawl_task
    # crawl_task >> scrape_task
    # crawl_task >> scrape_task >> save_task
    crawl_task >> scrape_task >> save_task >> sent_task