from flask import request, jsonify, Flask
from middleware.auth import authentication
from .config import ROUTE

route = ROUTE['news']
def init(app: Flask):
    from controllers import newsController
    @app.route(route, methods=['GET'])
    def get_test_summarize():
        return 'test news'
    
    @app.route(route + '/summarize', methods=['POST'])
    def summarize():
        return newsController.summarize(request)
    


