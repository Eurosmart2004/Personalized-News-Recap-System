from server.database.database import db
from datetime import datetime

class UserNews(db.Model):
    __tablename__ = 'user_news'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    news_id = db.Column(db.Integer, db.ForeignKey('news.id'), primary_key=True)
    sent_at = db.Column(db.DateTime, default=datetime.now())  # Timestamp

    def __repr__(self):
        return f'<UserNews user_id={self.user_id}, news_id={self.news_id}>'
