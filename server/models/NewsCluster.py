from database.database import db
from datetime import datetime, timezone

class NewsCluster(db.Model):
    __tablename__ = 'news_cluster'
    news_id = db.Column(db.Integer, db.ForeignKey('news.id'), primary_key=True)
    cluster_id = db.Column(db.Integer, db.ForeignKey('cluster.id'), primary_key=True)