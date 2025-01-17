from database.database import db
from datetime import datetime, timezone

class NewsCluster(db.Model):
    __tablename__ = 'news_cluster'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False, unique=True)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(120), nullable=False)
    date = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    def __repr__(self):
        return f'<Topic: {self.topic} | Title: {self.title}>'

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'type': self.type,
            'date': self.date,
        }