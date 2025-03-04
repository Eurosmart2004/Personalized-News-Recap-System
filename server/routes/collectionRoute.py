from flask import Flask, request, make_response, jsonify
from middleware.auth import authentication
from .config import ROUTE
import logging

route = ROUTE['collection']

def init(app: Flask):
    logging.info("Initializing collectionRoute...")
    from controllers import collectionController

    @app.route(route, methods=['GET'])
    @authentication
    def get_collections():
        return collectionController.get_collections(request)
    
    @app.route(route, methods=['POST'])
    @authentication
    def create_collection():
        return collectionController.create_collection(request)
    
    @app.route(route, methods=['PUT'])
    @authentication
    def update_collection():
        return collectionController.update_collection(request)

    @app.route(route, methods=['DELETE'])
    @authentication
    def delete_collection():
        return collectionController.delete_collection(request)
    
    @app.route(route + '/favorite', methods=['POST'])
    @authentication
    def add_favorite():
        return collectionController.add_favorite(request)

    @app.route(route + '/favorite', methods=['DELETE'])
    @authentication
    def remove_favorite():
        return collectionController.remove_favorite(request)
