from database.database import db
from datetime import datetime

class UserFavorite(db.Model):
    __tablename__ = 'user_favorite'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    news_id = db.Column(db.Integer, db.ForeignKey('news.id'), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)
    news = db.relationship('News', backref='user_favorites')

    def __repr__(self):
        return f'<UserFavorite {self.user_id} {self.news_id}>'
    
    def to_json(self):
        return {
            'user_id': self.user_id,
            'news_id': self.news_id,
            'news': self.news.to_json() if self.news else None,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }