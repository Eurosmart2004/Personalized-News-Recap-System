import requests
from datetime import datetime
from airflow import DAG
from airflow.operators.python import PythonOperator
from CrawDag.models import News
from CrawDag.crawling import crawl_rss
from CrawDag.scraping import scrape_basic_article
from CrawDag.saving_db import save_articles_to_db
import pytz
import os
from dotenv import load_dotenv

load_dotenv()
topic_url = {
    'economic': ['https://vnexpress.net/rss/kinh-doanh.rss',
                 'https://thanhnien.vn/rss/kinh-te.rss',
                ],
    'health': ['https://vnexpress.net/rss/suc-khoe.rss',
               'https://thanhnien.vn/rss/suc-khoe.rss,'
               ],
    'sport': ['https://vnexpress.net/rss/the-thao.rss',
              'https://thanhnien.vn/rss/the-thao.rss,'
              ],
}

def crawl_all_newspapers(**context):
    news = []
    for topic, urls in topic_url.items():
        for url in urls:
            news.extend(crawl_rss(topic, url)[:5])

    context['ti'].xcom_push(key='crawl_news', value=[new.to_json() for new in news])


    

def scrape_all_articles(**context):
    news_list_json = context['ti'].xcom_pull(task_ids='crawl_task', key='crawl_news')
    news = [News.from_json(news_json) for news_json in news_list_json]
    for new in news:
        scrape_basic_article(new)

    context['ti'].xcom_push(key='scrape_news', value=[new.to_json() for new in news])


def save_to_db(**context):
    news_list_json = context['ti'].xcom_pull(task_ids='scrape_task', key='scrape_news')
    news = [News.from_json(news_json) for news_json in news_list_json]
    news_list_id = save_articles_to_db(news)
    context['ti'].xcom_push(key='news_list_id', value=news_list_id)



def sent_all_articles(**context):
    news_list_id = context['ti'].xcom_pull(task_ids='save_to_db_task', key='news_list_id')
    print("news_list_id", news_list_id)
    print("Length of news_list_id", len(news_list_id))
    response = requests.post('http://server:5000/api/news/summarize', json=news_list_id)
    try:
        response_json = response.json()
        print(response_json)
    except requests.exceptions.JSONDecodeError:
        print("Failed to decode JSON from response")
        print(response.text)

with DAG(
    dag_id = 'CrawDag',
    description = 'Crawling news from multiple sources',
    start_date = datetime(2024,10,18, 0, 0 ,0, 0, tzinfo=pytz.timezone('Asia/Ho_Chi_Minh')),
    # schedule_interval='0 5-23 * * *',
    schedule_interval="@monthly",
) as dag:
    crawl_task = PythonOperator(
        task_id = 'crawl_task',
        python_callable = crawl_all_newspapers,
        provide_context = True
    )

    scrape_task = PythonOperator(
        task_id = 'scrape_task',
        python_callable = scrape_all_articles,
        provide_context = True
    )

    save_to_db_task = PythonOperator(
        task_id = 'save_to_db_task',
        python_callable = save_to_db,
        provide_context = True
    )

    sent_task = PythonOperator(
        task_id = 'sent_task',
        python_callable = sent_all_articles,
        provide_context = True
    )

    crawl_task >> scrape_task >> save_to_db_task >> sent_task
    # crawl_task >> scrape_task
    # crawl_task >> scrape_task >> save_to_db_task