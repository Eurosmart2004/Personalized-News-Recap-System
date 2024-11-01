from sqlalchemy.orm import relationship
from database.db import db
from datetime import datetime, timezone
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)
    email = db.Column(db.String(256), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=True)
    picture = db.Column(db.String(256), nullable=True)
    role = db.Column(db.String(50), nullable=False, default='user')
    createdAt = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    isConfirmed = db.Column(db.Boolean, default=False)
    isFirstLogin = db.Column(db.Boolean, default=True)
    codeNumber = db.Column(db.String(6), nullable=True)
    user_schedule = relationship('UserSchedule', backref='user')
    user_preference = relationship('UserPreference', backref='user')

    def __repr__(self):
        return f'<User {self.name}>'
    
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'picture': self.picture,
            'role': self.role,
            'isConfirmed': self.isConfirmed,
            'isFirstLogin': self.isFirstLogin
        }