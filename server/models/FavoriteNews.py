from database.database import db
from datetime import datetime, timezone
import pytz

class FavoriteNews(db.Model):
    __tablename__ = 'favorite_news'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    search = db.Column(db.String(256), nullable=False)
    createAt = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updateAt = db.Column(db.DateTime, default=None, nullable=True)
    def __repr__(self):
        return f'<FavoriteNews: {self.search}>'

    def to_json(self):
        createAt = (
            self.createAt.astimezone(pytz.timezone('Asia/Ho_Chi_Minh'))
            .strftime('%H:%M %d/%m/%Y (GMT%z)') if self.createAt else None
        )
        
        updateAt = None
        if self.updateAt:
            updateAt = (
                self.updateAt.astimezone(pytz.timezone('Asia/Ho_Chi_Minh'))
                .strftime('%H:%M %d/%m/%Y (GMT%z)') if self.updateAt else None
            )

        return {
            'id': self.id,
            'search': self.search,
            'createAt': createAt,
            'updateAt': updateAt
        }