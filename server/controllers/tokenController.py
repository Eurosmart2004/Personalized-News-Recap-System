from flask import Request, Response, jsonify, make_response
from services import tokenService
from dotenv import load_dotenv
import os
load_dotenv()

def refreshToken(request: Request) -> Response:
    token = request.cookies.get('refreshToken')
    if not token:
        return make_response(jsonify({'error': 'No token found'}), 400)
    try:
        accessToken, refreshToken, user = tokenService.refresh_token(token)
        response = make_response({
            'accessToken': accessToken,
            # 'user': user
        }, 200)
        response.set_cookie('refreshToken', 
                        refreshToken, 
                        httponly=True, 
                        samesite='None', 
                        secure=True, 
                        max_age=int(os.getenv('REFRESH_TOKEN_EXPIRATION')))
        return response
    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 400)