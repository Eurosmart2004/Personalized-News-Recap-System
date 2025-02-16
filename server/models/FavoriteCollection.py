from database.database import db
from datetime import datetime

class FavoriteCollection(db.Model):
    __tablename__ = 'favorite_collections'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False, default="Favorites")  # Ensure name is not null
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    # Relationship to UserFavorite
    favorites = db.relationship('UserFavorite', backref='collection', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<FavoriteCollection {self.id} {self.name}>'

    def to_json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'favorites': [favorite.to_json() for favorite in self.favorites]
        }

    @staticmethod
    def create_default_collection(user_id):
        """Ensure that a default 'Favorites' collection exists for a user."""
        existing_collection = FavoriteCollection.query.filter_by(user_id=user_id, name="Favorites").first()
        if not existing_collection:
            default_collection = FavoriteCollection(user_id=user_id, name="Favorites")
            db.session.add(default_collection)
            db.session.commit()
            return default_collection
        return existing_collection