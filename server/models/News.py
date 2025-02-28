from database.database import db
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
import pytz

class News(db.Model):
    __tablename__ = 'news'
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(120), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    link = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    summary = db.Column(db.Text)
    image = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    favorite_collection = relationship('FavoriteCollection', backref='news')
    news_cluster = relationship('NewsCluster', backref='news')

    def __repr__(self):
        return f'<Topic: {self.topic} | Title: {self.title}>'

    def to_json(self):
        formatted_date = (
            self.date.astimezone(pytz.timezone('Asia/Ho_Chi_Minh'))
            .strftime('%H:%M:%S %d/%m/%Y (GMT%z)') if self.date else None
        )

        return {
            'id': self.id,
            'topic': self.topic,
            'title': self.title,
            'link': self.link,
            # 'content': self.content,
            'summary': self.summary,
            'image': self.image,
            'date': formatted_date,
        }