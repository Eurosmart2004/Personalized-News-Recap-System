from database.database import db
from datetime import datetime, timezone

class Cluster(db.Model):
    __tablename__ = 'cluster'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False, unique=True)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(120), nullable=False)
    date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    news_cluster = db.relationship('NewsCluster', backref='cluster')

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'type': self.type,
            'date': self.date,
        }