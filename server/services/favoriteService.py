from models.UserFavorite import UserFavorite
from database.database import db

def add_favorite(user_id, news_id):
    if not user_id or not news_id:
        raise ValueError('user_id and news_id are required')

    # Check if the favorite already exists
    existing_favorite = UserFavorite.query.filter_by(user_id=user_id, news_id=news_id).first()
    if existing_favorite:
        raise ValueError('Favorite already exists')

    # Create a new favorite
    favorite = UserFavorite(user_id=user_id, news_id=news_id)
    db.session.add(favorite)
    db.session.commit()
    return favorite.to_json()

def remove_favorite(user_id, news_id):
    if not user_id or not news_id:
        raise ValueError('user_id and news_id are required')

    # Find the favorite
    favorite = UserFavorite.query.filter_by(user_id=user_id, news_id=news_id).first()
    if not favorite:
        raise ValueError('Favorite not found')

    # Remove the favorite
    db.session.delete(favorite)
    db.session.commit()
    return {'message': 'Favorite removed'}

def get_favorites(user_id):
    if not user_id:
        raise ValueError('user_id is required')

    # Fetch all favorites for the user
    favorites = UserFavorite.query.filter_by(user_id=user_id).all()
    return [favorite.to_json() for favorite in favorites]
