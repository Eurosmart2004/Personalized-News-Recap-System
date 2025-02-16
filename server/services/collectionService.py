from models.FavoriteCollection import FavoriteCollection
from models.UserFavorite import UserFavorite
from database.database import db

def create_collection(user_id, name):
    if not user_id or not name:
        raise ValueError('user_id and name are required')

    collection = FavoriteCollection(user_id=user_id, name=name)
    db.session.add(collection)
    db.session.commit()
    return collection.to_json()

def get_collections(user_id):
    if not user_id:
        raise ValueError('user_id is required')

    collections = FavoriteCollection.query.filter_by(user_id=user_id).all()
    return [collection.to_json() for collection in collections]

def add_to_collection(collection_id, news_id):
    if not collection_id or not news_id:
        raise ValueError('collection_id and news_id are required')

    favorite = UserFavorite.query.filter_by(collection_id=collection_id, news_id=news_id).first()
    if favorite:
        raise ValueError('News is already in this collection')

    new_favorite = UserFavorite(user_id=favorite.user_id, news_id=news_id, collection_id=collection_id)
    db.session.add(new_favorite)
    db.session.commit()
    return new_favorite.to_json()

def remove_from_collection(collection_id, news_id):
    if not collection_id or not news_id:
        raise ValueError('collection_id and news_id are required')

    favorite = UserFavorite.query.filter_by(collection_id=collection_id, news_id=news_id).first()
    if not favorite:
        raise ValueError('News not found in this collection')

    db.session.delete(favorite)
    db.session.commit()
    return {'message': 'News removed from collection'}

def delete_collection(collection_id):
    if not collection_id:
        raise ValueError('collection_id is required')

    collection = FavoriteCollection.query.filter_by(id=collection_id).first()
    if not collection:
        raise ValueError('Collection not found')

    db.session.delete(collection)
    db.session.commit()
    return {'message': 'Collection deleted'}
