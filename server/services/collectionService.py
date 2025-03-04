from models import Collection, FavoriteCollection, News
from database.database import db
from typing import Union

def get_collections(user_id):
    """
    return [
        {
            collection: {
                'id': 1,
                'name': 'collection1'
            },
            news: [
                {
                    'id': 1,
                    'title': 'news1',
                    'description': 'news1 description',
                    'url': 'news1 url',
                    'urlToImage': 'news1 image',
                    'publishedAt': 'news1 date',
                    'content': 'news1 content'
                },
                {
                    'id': 2,
                    'title': 'news2',
                    'description': 'news2 description',
                    'url': 'news2 url',
                    'urlToImage': 'news2 image',
                    'publishedAt': 'news2 date',
                    'content': 'news2 content'
                }
            ]
        }
    ]
    """
    list_collections = []
    collections: list[Collection] = Collection.query.filter_by(user_id=user_id).all()
    for collection in collections:
        news = []
        favorite_collections: FavoriteCollection = FavoriteCollection.query.filter_by(collection_id=collection.id).all()
        for favorite_collection in favorite_collections:
            news.append(favorite_collection.news.to_json())
        list_collections.append({
            'collection': collection.to_json(),
            'news': news
        })
    
    return list_collections

def create_collection(user_id, name):
    if Collection.query.filter_by(user_id=user_id, name=name).first():
        raise ValueError('Collection already exists')

    collection = Collection(user_id=user_id, name=name)
    db.session.add(collection)
    db.session.commit()

    return get_collections(user_id)

def update_collection(user_id, collection_id, name):
    collection: Union[Collection, None] = Collection.query.filter_by(user_id=user_id, id=collection_id).first()
    if not collection:
        raise ValueError('Collection not found')

    collection.name = name
    db.session.commit()
    return get_collections(user_id)

def delete_collection(user_id, collection_id):
    collection: Union[Collection, None] = Collection.query.filter_by(user_id=user_id, id=collection_id).first()
    if not collection:
        raise ValueError('Collection not found')

    favorite_collections: list[FavoriteCollection] = FavoriteCollection.query.filter_by(collection_id=collection_id).all()
    for favorite_collection in favorite_collections:
        db.session.delete(favorite_collection)

    db.session.delete(collection)
    db.session.commit()
    return get_collections(user_id)

def add_favorite(user_id, list_collection_id, news_id):
    news: Union[News, None] = News.query.filter_by(id=news_id).first()
    if not news:
        raise ValueError('News not found')

    for collection_id in list_collection_id:
        collection: Union[Collection, None] = Collection.query.filter_by(user_id=user_id, id=collection_id).first()
        if not collection:
            raise ValueError('Collection not found')
        

        favorite_collection = FavoriteCollection(collection_id=collection_id, news_id=news_id)
        db.session.add(favorite_collection)
    
    db.session.commit()

    return get_collections(user_id)

def remove_favorite(user_id, list_collection_id, news_id):
    for collection_id in list_collection_id:
        favorite_collection: Union[FavoriteCollection, None] = FavoriteCollection.query.filter_by(collection_id=collection_id, news_id=news_id).first()
        if not favorite_collection:
            raise ValueError('Favorite not found')

        db.session.delete(favorite_collection)
        
    db.session.commit()
    return get_collections(user_id)