from flask import Flask, request, make_response, jsonify
from .config import ROUTE
import logging

route = ROUTE['collection']

def init(app: Flask):
    logging.info("Initializing collectionRoute...")
    from controllers import collectionController

    @app.route(route, methods=['POST'])
    def create_collection():
        return collectionController.create_collection(request)

    @app.route(route + '/<int:user_id>', methods=['GET'])
    def get_collections(user_id):
        return collectionController.get_collections(user_id)

    @app.route(route + '/<int:collection_id>/add', methods=['POST'])
    def add_to_collection(collection_id):
        return collectionController.add_to_collection(request, collection_id)

    @app.route(route + '/<int:collection_id>/remove/<int:news_id>', methods=['DELETE'])
    def remove_from_collection(collection_id, news_id):
        return collectionController.remove_from_collection(collection_id, news_id)

    @app.route(route + '/<int:collection_id>', methods=['DELETE'])
    def delete_collection(collection_id):
        return collectionController.delete_collection(collection_id)
    logging.info("collectionRoute successfully initialized.")