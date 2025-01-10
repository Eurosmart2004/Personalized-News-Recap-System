
from flask import Request, Response, jsonify, make_response
from services import favoriteService
import logging
def add_favorite(request: Request) -> Response:
    data = request.get_json()
    try:
        user_id = data['user_id']
        news_id = data['news_id']
        favorite = favoriteService.add_favorite(user_id, news_id)
        return jsonify(favorite), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

def remove_favorite(request: Request) -> Response:
    logging.info(request)
    data = request.get_json()
    logging.info("---------------")
    logging.info(data)
    try:
        user_id = data['user_id']
        news_id = data['news_id']
        message = favoriteService.remove_favorite(user_id, news_id)
        return jsonify(message), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

def get_favorites(user_id):
    try:
        favorites = favoriteService.get_favorites(user_id)
        return jsonify(favorites), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400