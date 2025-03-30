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
    
    @app.route(route + '/image', methods=['GET'])
    def get_image():
        return newsController.get_image(request)
    
    @app.route(route + '/favorite', methods=['GET', 'POST', 'PUT', 'DELETE'])
    @authentication
    def news_favorite():
        if request.method == 'GET':
            return newsController.get_favorite_news(request)

        if request.method == 'POST':
            return newsController.post_favorite_news(request)
        
        if request.method == 'PUT':
            return newsController.put_favorite_news(request)
    
        if request.method == 'DELETE':
            return newsController.delete_favorite_news(request)

    @app.route(route + '/favorite/search', methods=['POST'])
    @authentication
    def search_favorite_news():
        return newsController.search_news(request)

