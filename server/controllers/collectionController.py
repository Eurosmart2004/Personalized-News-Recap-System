from flask import Request, Response, jsonify, make_response
from services import collectionService
import logging
def get_collections(request: Request) -> Response:
    user_id = request.userID
    try:
        list_collections = collectionService.get_collections(user_id)
        return make_response(jsonify({
            'message': 'Collection retrieved successfully',
            'collections': list_collections
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def create_collection(request: Request) -> Response:
    user_id = request.userID
    data = request.get_json()

    if 'name' not in data:
        return make_response(jsonify({'error': 'Missing name fields'}), 400)
    name = data['name']

    try:
        list_collections = collectionService.create_collection(user_id, name)
        return make_response(jsonify({
            'message': 'Collection created successfully',
            'collections': list_collections
        }), 201)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def update_collection(request: Request) -> Response:
    user_id = request.userID
    data = request.get_json()

    if 'collection_id' not in data or 'name' not in data:
        return make_response(jsonify({'error': 'Missing collection_id or name fields'}), 400)
    collection_id = data['collection_id']
    name = data['name']

    try:
        list_collections = collectionService.update_collection(user_id, collection_id, name)
        return make_response(jsonify({
            'message': 'Collection updated successfully',
            'collections': list_collections
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)

def delete_collection(request: Request) -> Response:
    user_id = request.userID
    data = request.get_json()

    if 'collection_id' not in data:
        return make_response(jsonify({'error': 'Missing collection_id fields'}), 400)
    collection_id = data['collection_id']

    try:
        list_collections =  collectionService.delete_collection(user_id, collection_id)
        return make_response(jsonify({
            'collections': list_collections,
            'message': 'Collection deleted successfully'
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def add_favorite(request: Request) -> Response:
    user_id = request.userID
    data = request.get_json()

    if 'list_collection_id' not in data or 'news_id' not in data:
        return make_response(jsonify({'error': 'Missing list_collection_id or news_id fields'}), 400)
    list_collection_id = data['list_collection_id']
    news_id = data['news_id']

    try:
        list_collections = collectionService.add_favorite(user_id, list_collection_id, news_id)
        return make_response(jsonify({
            'message': 'News added to collection successfully',
            'collections': list_collections
        }), 201)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def remove_favorite(request: Request) -> Response:
    user_id = request.userID
    data = request.get_json()

    if 'list_collection_id' not in data or 'news_id' not in data:
        return make_response(jsonify({'error': 'Missing list_collection_id or news_id fields'}), 400)
    list_collection_id = data['list_collection_id']
    news_id = data['news_id']

    try:
        list_collections = collectionService.remove_favorite(user_id, list_collection_id, news_id)
        return make_response(jsonify({
            'message': 'News removed from collection successfully',
            'collections': list_collections
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)