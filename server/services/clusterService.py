from models import News, NewsCluster, Cluster
from database.database import db
from datetime import datetime, timedelta
import calendar

DURATION = {
    "day": timedelta(days=1),
    "week": timedelta(weeks=1),
    "month": timedelta(days=30),
}

def get_cluster(duration: str, date: datetime) -> list[Cluster.to_json]:
    if duration == "day":
        start_date = date.replace(hour=0, minute=0, second=0)
        end_date = date.replace(hour=23, minute=59, second=59)
    elif duration == "week":
        start_date = date - timedelta(days=date.weekday())  # Start of the week (Monday)
        start_date = start_date.replace(hour=0, minute=0, second=0)
        end_date = start_date + timedelta(days=6, hours=23, minutes=59, seconds=59)  # End of the week (Sunday)
    elif duration == "month":
        start_date = date.replace(day=1, hour=0, minute=0, second=0)  # Start of the month
        last_day = calendar.monthrange(date.year, date.month)[1]  # Last day of the month
        end_date = date.replace(day=last_day, hour=23, minute=59, second=59)  # End of the month

    list_cluster: list[Cluster] = Cluster.query.filter_by(type=duration).filter(Cluster.date >= start_date, Cluster.date <= end_date).all()

    list_cluster_json = [cluster.to_json() for cluster in list_cluster]
    for cluster in list_cluster_json:
        news_cluster = NewsCluster.query.filter_by(cluster_id=cluster['id']).all()
        news_id_list = [news.news_id for news in news_cluster]
        news_list = News.query.filter(News.id.in_(news_id_list)).all()
        news_list_json = [news.to_json() for news in news_list]
        cluster['news'] = news_list_json

    return list_cluster_json




def get_cluster_by_id(id: int) -> Cluster.to_json:
    cluster = Cluster.query.get(id)
    if not cluster:
        raise ValueError("Cluster not found")
    
    cluster_json = cluster.to_json()
    news_cluster = NewsCluster.query.filter_by(cluster_id=cluster_json['id']).all()
    news_id_list = [news.news_id for news in news_cluster]
    news_list = News.query.filter(News.id.in_(news_id_list)).all()
    news_list_json = [news.to_json() for news in news_list]
    cluster_json['news'] = news_list_json

    return cluster_json