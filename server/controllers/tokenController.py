from flask import Request, Response, jsonify, make_response
from services import tokenService
from dotenv import load_dotenv
import os
import logging
load_dotenv()

def refreshToken(request: Request) -> Response:
    token = request.cookies.get('refreshToken')
    data = request.get_json()
    if not token:
        return make_response(jsonify({'error': 'No token found'}), 400)
    isRemember: bool = data['isRemember'] if 'isRemember' in data else False
    try:
        accessToken, refreshToken = tokenService.refresh_token(token)
        response = make_response({
            'accessToken': accessToken,
        }, 200)
        response.set_cookie('refreshToken', 
                            refreshToken, 
                            httponly=True, 
                            samesite='None', 
                            secure=True, 
                            max_age=int(os.getenv('REFRESH_TOKEN_EXPIRATION')) if isRemember else None
                            )

        return response
    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 400)