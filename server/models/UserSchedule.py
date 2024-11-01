from database.db import db
class UserSchedule(db.Model):
    __tablename__ = 'user_schedule'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedule.id'), primary_key=True)

    def __repr__(self):
        return f'<UserSchedule {self.user_id} {self.schedule_id}>'
    def to_json(self):
        return {
            'user_id': self.user_id,
            'schedule_id': self.schedule_id
        }