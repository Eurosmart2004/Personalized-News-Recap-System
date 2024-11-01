from sqlalchemy.orm import relationship
from database.db import db
from datetime import time

class Schedule(db.Model):
    __tablename__ = 'schedule'
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.Time, nullable=False)
    user_schedule = relationship('UserSchedule', backref='schedule')
    
    def __repr__(self):
        return f'<{self.time}>'
    
    def to_json(self):
        return {
            'id': self.id,
            'hour': self.time.hour,
            'minute': self.time.minute
        }