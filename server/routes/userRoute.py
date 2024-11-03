from flask import request, jsonify, Flask
from middleware.auth import authentication
from controllers import userController
from .config import ROUTE

route = ROUTE['user']


def init(app: Flask):
    @app.route(route, methods=['GET', 'PUT'])
    @authentication
    def get_user():
        if request.method == 'GET':
            return userController.get_user(request)
        if request.method == 'PUT':
            return userController.update_user(request)
        
    @app.route(route + '/forgot-password', methods=['POST'])
    def forgot_password():
        return userController.forgot_password(request)

    @app.route(route + '/reset-password', methods=['POST'])
    def reset_password():
        return userController.reset_password(request)
    
    @app.route(route + '/register', methods=['POST'])
    def register():
        return userController.register(request)
    
    @app.route(route + '/confirm', methods=['GET','PUT'])
    def confirm_user():
        if request.method == 'GET':
            return userController.get_confirm_user(request)
        if request.method == 'PUT':
            return userController.update_confirm_user(request)
    
    @app.route(route + '/login', methods=['POST'])
    def login():
        return userController.login(request)
    
    @app.route(route + '/login/google', methods=['POST'])
    def login_with_google():
        return userController.login_with_google(request)
    
    @app.route(route + '/logout', methods=['POST'])
    def logout():
        return userController.logout(request)
    
    @app.route(route + '/preferences', methods=['GET','PUT'])
    @authentication
    def update_preferences():
        if request.method == 'GET':
            return userController.get_preferences(request)
        if request.method == 'PUT':
            return userController.update_preferences(request)
        

    @app.route(route + '/schedule', methods=['GET','PUT'])
    @authentication
    def update_schedule():
        if request.method == 'GET':
            return userController.get_schedule(request)
        if request.method == 'PUT':
            return userController.update_schedule(request)
