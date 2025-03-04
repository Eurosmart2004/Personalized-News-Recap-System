from models import  News, NewsCluster, Cluster
from database.database import db
from datetime import datetime, timedelta
DURATION = {
    "day": timedelta(days=1),
    "week": timedelta(days=7),
    "month": timedelta(days=60),
}


def get_cluster(duration: str) -> list[Cluster.to_json]:
    now = datetime.now()
    start_date = now - DURATION[duration]
    list_cluster:list[Cluster] = Cluster.query.filter_by(type=duration).filter(Cluster.date >= start_date).all()

    list_cluster_json = [cluster.to_json() for cluster in list_cluster]
    for cluster in list_cluster_json:
        news_cluster = NewsCluster.query.filter_by(cluster_id=cluster['id']).all()
        news_id_list = [news.news_id for news in news_cluster]
        news_list = News.query.filter(News.id.in_(news_id_list)).all()
        news_list_json = [news.to_json() for news in news_list]
        cluster['news'] = news_list_json

    return list_cluster_json


        
