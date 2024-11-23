from sqlalchemy.orm import relationship
from server.database.database import db

class Preference(db.Model):
    __tablename__ = 'preferences'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    user_preference = relationship('UserPreference', backref='preference')

    def __repr__(self):
        return f'<Preference {self.name}>'
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name
        }