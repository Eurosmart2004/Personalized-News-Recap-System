from database.db import db
class UserPreference(db.Model):
    __tablename__ = 'user_preferences'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    preference_id = db.Column(db.Integer, db.ForeignKey('preferences.id'), primary_key=True)

    def __repr__(self):
        return f'<UserPreference {self.user_id} {self.preference_id}>'
    def to_json(self):
        return {
            'user_id': self.user_id,
            'preference_id': self.preference_id
        }