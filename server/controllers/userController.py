from flask import Request, Response, jsonify, make_response
from services import userService
from dotenv import load_dotenv
import os
load_dotenv()

def get_user(request: Request) -> Response:
    userID = request.userID
    try:
        user = userService.get_user(userID)
        return make_response(user.to_json(), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def update_user(request: Request) -> Response:
    data = request.get_json()
    keys = ['name', 'picture']
    for key in keys:
        if key not in data:
            return make_response(jsonify({'error': f'Missing required field {key}'}), 400)
    
    userID = request.userID
    name = data['name']
    picture = data['picture']

    try:
        user = userService.update_user(userID, name, picture)
        return make_response(user.to_json(), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)

def register(request: Request) -> Response:
    data = request.get_json()
    keys = ['name', 'email', 'password']
    for key in keys:
        if key not in data:
            return make_response(jsonify({'error': f'Missing required field {key}'}), 400)
    
    name = data['name']
    email = data['email']
    password = data['password']

    try:
        accessToken, refreshToken, user = userService.register(name, email, password)
        response = make_response({
            'accessToken': accessToken,
            'user': user
        }, 200)

        response.set_cookie('refreshToken', 
                            refreshToken, 
                            httponly=True, 
                            samesite='None', 
                            secure=True, 
                            max_age=int(os.getenv('REFRESH_TOKEN_EXPIRATION')))
        return response
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def get_confirm_user(request: Request) -> Response:
    email = request.args.get('email')
    print(email)
    try:
        userService.get_confirm_user(email)
        return make_response(jsonify({'message': 'Please confirm the email'}), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)

def update_confirm_user(request: Request) -> Response:
    data = request.get_json()

    keys = ['code', 'email']
    for key in keys:
        if key not in data:
            return make_response(jsonify({'error': f'Missing required field {key}'}), 400)
    try:
        accessToken, refreshToken, user = userService.update_confirm_user(data['email'], data['code'])
        response = make_response({
            'accessToken': accessToken,
            'user': user
        }, 200)

        response.set_cookie('refreshToken', 
                            refreshToken, 
                            httponly=True, 
                            samesite='None', 
                            secure=True, 
                            max_age=int(os.getenv('REFRESH_TOKEN_EXPIRATION')))
        return response
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def login(request: Request) -> Response:
    data = request.get_json()
    keys = ['email', 'password']
    for key in keys:
        if key not in data:
            return make_response(jsonify({'error': f'Missing required field {key}'}), 400)
    
    email = data['email']
    password = data['password']
    
    try:
        accessToken, refreshToken, user = userService.login(email, password)
        
        response = make_response({
            'accessToken': accessToken,
            'user': user
        }, 200)

        response.set_cookie('refreshToken', 
                            refreshToken, 
                            httponly=True, 
                            samesite='None', 
                            secure=True, 
                            max_age=int(os.getenv('REFRESH_TOKEN_EXPIRATION')))
        return response
    
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def login_with_google(request: Request) -> Response:
    data = request.get_json()
    if 'token' not in data:
        return make_response(jsonify({'error': 'Missing token fields'}), 400)
    token = data['token']
    try:
        accessToken, refreshToken, user = userService.login_with_google(token)
        
        response = make_response({
            'accessToken': accessToken,
            'user': user
        }, 200)

        response.set_cookie('refreshToken', 
                            refreshToken, 
                            httponly=True, 
                            samesite='None', 
                            secure=True, 
                            max_age=int(os.getenv('REFRESH_TOKEN_EXPIRATION')))
        return response
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)

def logout(request: Request) -> Response:
    response = make_response(jsonify({'message': 'Logout successful'}), 200)
    response.set_cookie('refreshToken', '', httponly=True)
    return response

def get_preferences(request: Request) -> Response:
    userID = request.userID
    preferences = userService.get_preferences(userID)
    return make_response(jsonify({'preferences': preferences}), 200)
    
def update_preferences(request: Request) -> Response:
    data = request.get_json()
    if "preferences" not in data:
        return make_response(jsonify({'error': 'Missing required fields'}), 400)
    
    preferences = data['preferences']
    userID = request.userID
    
    try:
        preferencesList = userService.update_preferences(userID, preferences)
        return make_response(jsonify({'preferences': preferencesList}), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def get_schedule(request: Request) -> Response:
    userID = request.userID
    try:
        schedules = userService.get_schedule(userID)
        return make_response(jsonify({'schedule': schedules}), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def update_schedule(request: Request) -> Response:
    data = request.get_json()
    if "schedule" not in data:
        return make_response(jsonify({'error': 'Missing schedule fields'}), 400)
    
    schedule = data['schedule']
    userID = request.userID
    
    try:
        schedules = userService.update_schedule(userID, schedule)
        return make_response(jsonify({'schedule': schedules}), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)