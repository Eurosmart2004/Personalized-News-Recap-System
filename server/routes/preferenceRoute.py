from flask import request, jsonify, Flask
from controllers import preferenceController
from .config import ROUTE
from middleware.auth import authentication, authorization
route = ROUTE['preference']
def init(app: Flask):
    @app.route(route, methods=['GET'])
    @authentication
    @authorization(['admin'])
    def get_preference():
        return preferenceController.get_preference(request)
    
    @app.route(route, methods=['POST'])
    @authentication
    @authorization(['admin'])
    def create_preference():
        return preferenceController.create_preference(request)
    
    @app.route(route, methods=['PUT'])
    @authentication
    @authorization(['admin'])
    def update_preference():
        return preferenceController.update_preference(request)
    

    @app.route(route, methods=['DELETE'])
    @authentication
    @authorization(['admin'])
    def delete_preference():
        return preferenceController.delete_preference(request)
