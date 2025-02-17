from database.database import db
from datetime import datetime

class FavoriteCollection(db.Model):
    __tablename__ = 'favorite_collections'
    collection_id = db.Column(db.Integer, db.ForeignKey('collections.id'), primary_key=True)
    news_id = db.Column(db.Integer, db.ForeignKey('news.id'), primary_key=True)

    def to_json(self):
        return {
            'id': self.id,
            'collection_id': self.collection_id,
            'news_id': self.news_id,
        }