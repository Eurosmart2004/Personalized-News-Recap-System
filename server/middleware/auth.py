from functools import wraps
from flask import request, jsonify
from services import tokenService, userService
from dotenv import load_dotenv
import os
load_dotenv()
def authentication(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or ' ' not in auth_header:
            return jsonify({'message': 'Missing or malformed auth token'}), 403
        
        auth_token = auth_header.split(' ')[1]
        if not auth_token:
            return jsonify({'message': 'Missing auth token'}), 403
        try:
            payload = tokenService.decode_token(auth_token, os.environ.get('ACCESS_TOKEN_KEY'))
            request.userID = payload['id']
            request.role = payload['role']
            try:
                user = userService.get_user(request.userID)
            except ValueError as e:
                return jsonify({'message': str(e)}), 403
        except Exception as e:
            return jsonify({'message': 'Invalid token'}), 403
        return f(*args, **kwargs)
    return decorated


def authorization(roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if request.role not in roles:
                return jsonify({'message': 'Unauthorized'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator