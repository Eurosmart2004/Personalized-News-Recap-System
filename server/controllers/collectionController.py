from flask import Request, Response, jsonify, make_response
from services import collectionService

def create_collection(request: Request) -> Response:
    data = request.get_json()
    try:
        user_id = data['user_id']
        name = data['name']
        collection = collectionService.create_collection(user_id, name)
        return make_response(jsonify({
            'message': 'Collection created successfully',
            'collection': collection
        }), 200)
    
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)

def get_collections(user_id):
    try:
        collections = collectionService.get_collections(user_id)
        return make_response(jsonify({
            'message': 'Collection retrieved successfully',
            'collection': collections
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)

def add_to_collection(request: Request, collection_id) -> Response:
    data = request.get_json()
    try:
        news_id = data['news_id']
        collection = collectionService.add_to_collection(collection_id, news_id)
        return make_response(jsonify({
            'message': 'Added to collection successfully',
            'collection': collection
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)

def remove_from_collection(collection_id, news_id):
    try:
        message = collectionService.remove_from_collection(collection_id, news_id)
        return make_response(jsonify({
            'message': 'Removed from collection successfully',
            'collection': message
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)

def delete_collection(collection_id):
    try:
        message = collectionService.delete_collection(collection_id)
        return make_response(jsonify({
            'message': 'Collection deleted successfully',
            'collection': message
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
