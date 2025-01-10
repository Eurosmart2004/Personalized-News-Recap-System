from database.database import db
from datetime import datetime, timezone
import pytz

class Token(db.Model):
    __tablename__ = 'tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    token = db.Column(db.String(256), nullable=False)
    createAt = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    type = db.Column(db.String(50), nullable=False)
    valid = db.Column(db.Boolean, default=True)
    def __repr__(self):
        return f'<Token: {self.token} | type: {self.type}>'

    def to_json(self):
        formatted_date = (
            self.createAt.astimezone(pytz.timezone('Asia/Ho_Chi_Minh'))
            .strftime('%H:%M %d/%m/%Y (GMT%z)') if self.date else None
        )

        return {
            'id': self.id,
            'token': self.token,
            'createAt': formatted_date,
            'type': self.type,
            'valid': self.valid
        }