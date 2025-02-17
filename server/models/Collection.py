from sqlalchemy.orm import relationship
from database.database import db

class Collection(db.Model):
    __tablename__ = 'collections'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    favorite_collection = relationship('FavoriteCollection', backref='collections')

    def __repr__(self):
        return f'<Preference {self.name}>'
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name
        }