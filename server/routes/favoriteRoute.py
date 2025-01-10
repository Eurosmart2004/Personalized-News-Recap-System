from flask import Flask, request
from .config import ROUTE

route = ROUTE['favorite']

def init(app: Flask):
    from controllers import favoriteController
    
    @app.route(route, methods=['POST'])
    def add_favorite():
        return favoriteController.add_favorite(request)

    @app.route(route, methods=['DELETE'])
    def remove_favorite():
        return favoriteController.remove_favorite(request)

    @app.route(route + '/<int:user_id>', methods=['GET'])
    def get_favorites(user_id):
        return favoriteController.get_favorites(user_id)