from flask import request, jsonify, Flask
from middleware.auth import authentication
from .config import ROUTE

route = ROUTE['news']
def init(app: Flask):
    from controllers import newsController
    @app.route(route, methods=['GET'])
    def get_test_summarize():
        return 'test news'

    @app.route(route + '/get', methods=['GET'])
    @authentication
    def get_user_news():
        return newsController.get_user_news(request)
    
    @app.route(route + '/summarize', methods=['POST'])
    def summarize():
        return newsController.summarize(request)
    


