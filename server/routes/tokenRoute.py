from flask import request, jsonify, Flask
from controllers import tokenController
from .config import ROUTE

route = ROUTE['token']
def init(app: Flask):
    @app.route(route, methods=['GET'])
    def get_test():
        return 'test token route'
    
    @app.route(route + '/refresh', methods=['POST'])
    def refreshToken():
        return tokenController.refreshToken(request)
    