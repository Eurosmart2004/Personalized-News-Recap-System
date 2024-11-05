import jwt
from jwt.exceptions import ExpiredSignatureError
import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from models import Token, User
load_dotenv()

def create_token(payload: dict, key: str, expiration: int) -> str:
    payload['exp'] = datetime.now(tz=timezone.utc) + timedelta(seconds=expiration)
    return jwt.encode(
        payload=payload, 
        key=key,
        algorithm=os.environ.get('JWT_ALGORITHM'),
    )

def create_access_token(payload: dict) -> str:
    return create_token(payload=payload, 
                        key=os.environ.get('ACCESS_TOKEN_KEY'), 
                        expiration=int(os.environ.get('ACCESS_TOKEN_EXPIRATION')))



def create_refresh_token(payload: dict) -> str:
    return create_token(payload=payload, 
                        key=os.environ.get('REFRESH_TOKEN_KEY'), 
                        expiration=int(os.environ.get('REFRESH_TOKEN_EXPIRATION')))

def create_forgot_password_token(payload: dict) -> str:
    return create_token(payload=payload, 
                        key=os.environ.get('FORGOT_PASSWORD_TOKEN_KEY'), 
                        expiration=int(os.environ.get('FORGOT_PASSWORD_TOKEN_EXPIRATION')))

def create_confirm_token(payload: dict) -> str:
    return create_token(payload=payload, 
                        key=os.environ.get('CONFIRM_TOKEN_KEY'), 
                        expiration=int(os.environ.get('CONFIRM_TOKEN_EXPIRATION')))

def decode_token(token: str, key: str) -> any:
    return jwt.decode(
        jwt=token,
        key=key,
        algorithms=[os.environ.get('JWT_ALGORITHM')],
    )

def refresh_token(token: str) -> tuple:
    from .userService import get_user
    try:
        payload = decode_token(token, os.environ.get('REFRESH_TOKEN_KEY'))
    except ExpiredSignatureError:
        raise ValueError("Token has expired")
    user = get_user(payload['id'])
    accessToken = create_access_token(payload)
    refreshToken = create_refresh_token(payload)
    return accessToken, refreshToken, user.to_json()

def find_token(user_id:str, type:str, valid:bool = True) -> Token:
    return Token.query.filter_by(user_id=user_id, type=type, valid=valid).first()