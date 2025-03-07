from flask import Flask
from config.app_config import create_app
from services.userService import *
from models import Token, User
from database.database import db
from flask.testing import FlaskClient
import io
from pathlib import Path

# get the resources folder in the tests folder
resources = Path(__file__).parent / "resources"

def test_register_user(client: FlaskClient):
    response = client.post('/api/user/register', json={
        'email': 'lequangthien@yopmail.com',
        'password': '*Abcdef123456',
        'name': 'Le Quang Thien',
    })
        
    assert response.status_code == 200
    assert 'user' in response.json
    assert 'accessToken' in response.json
    cookies = response.headers.get('Set-Cookie')
    assert cookies is not None
    assert 'refreshToken=' in cookies


def test_get_confirm(client: FlaskClient):
    response = client.get('/api/user/confirm?email=lequangthien@yopmail.com')
    assert response.status_code == 200


def test_confirm_user(client: FlaskClient, app:Flask):
    with app.app_context():
        user: User = db.session.query(User).filter_by(email="lequangthien@yopmail.com").first()
        token: Token = db.session.query(Token).filter_by(user_id=user.id, type="confirm").first()

    response = client.put('/api/user/confirm', json={
        'token': token.token
    })
    
    assert response.status_code == 200


def test_login_user(client: FlaskClient):
    response = client.post('/api/user/login', json={
        'email': 'lequangthien@yopmail.com',
        'password': '*Abcdef123456',
    })

    assert response.status_code == 200
    assert 'user' in response.json
    assert 'accessToken' in response.json
    cookies = response.headers.get('Set-Cookie')
    assert cookies is not None
    assert 'refreshToken=' in cookies

def test_forgot_password(client: FlaskClient):
    response = client.post('/api/user/forgot-password', json={
        'email': 'lequangthien@yopmail.com'
    })

    assert response.status_code == 200
    assert 'message' in response.json
    assert response.json['message'] == 'Please check your email for the code'


def test_reset_password(client: FlaskClient, app:Flask):
    with app.app_context():
        user: User = db.session.query(User).filter_by(email="lequangthien@yopmail.com").first()
        token: Token = db.session.query(Token).filter_by(user_id=user.id, type="forgot_password").first()

    response = client.post('/api/user/reset-password', json={
        'token': token.token,
        'password': '*Abcdef123456',
    })


    assert response.status_code == 200

def test_log_out(client: FlaskClient):
    response = client.post('/api/user/logout', json={})

    assert response.status_code == 200
    assert 'message' in response.json
    assert response.json['message'] == 'Logout successful'
    cookies = response.headers.get('Set-Cookie')
    assert cookies is not None
    assert 'refreshToken=;' in cookies


# Private route need login
def test_get_user(client: FlaskClient, auth_headers):
    response = client.get('/api/user', headers=auth_headers)

    assert response.status_code == 200
    keys = ['isConfirmed', 'email', 'name', 'picture', 'role']
    for key in keys:
        assert key in response.json

def test_update_user(client: FlaskClient, auth_headers):
    response = client.put(
        '/api/user', 
        headers=auth_headers, 
        data={'name': 'Le Quang Thien123',},
        content_type='multipart/form-data'
    )

    assert response.status_code == 200
    assert 'name' in response.json
    assert response.json['name'] == 'Le Quang Thien123'

    with open((resources / "test.png"), "rb") as img_file:
        response = client.put(
            "/api/user",
            headers=auth_headers,
            data={
                "name": "Le Quang Thien",
                "picture": (img_file, "test.png")
            },
            content_type="multipart/form-data",
        )

    assert response.status_code == 200
    assert 'picture' in response.json
    assert response.json['picture'] is not None
    assert response.json['name'] == 'Le Quang Thien'



def test_get_user_preferences(client: FlaskClient, auth_headers):
    response = client.get('/api/user/preferences', headers=auth_headers)

    assert response.status_code == 200
    assert 'preferences' in response.json


def test_update_user_preferences(client: FlaskClient, auth_headers):
    response = client.put('/api/user/preferences', headers=auth_headers, json={
        "preferences": ["health", "economic", "sport"]
    })

    assert response.status_code == 200
    assert 'preferences' in response.json
    assert response.json['preferences'] == ["health", "economic", "sport"]


def test_get_user_schedule(client: FlaskClient, auth_headers):
    response = client.get('/api/user/schedule', headers=auth_headers)
    
    assert response.status_code == 200
    assert 'schedule' in response.json


def test_update_user_schedule(client: FlaskClient, auth_headers):
    response = client.put('/api/user/schedule', headers=auth_headers, json={
        "schedule": [
            {
                "hour": 9,
                "minute": 0
            },
            {
                "hour": 17,
                "minute": 0
            }
        ]
    })
    
    assert response.status_code == 200
    assert 'schedule' in response.json


def test_delete_user_schedule(client: FlaskClient, auth_headers):
    response = client.delete('/api/user/schedule', headers=auth_headers)
    
    assert response.status_code == 200
    assert 'schedule' in response.json
    assert response.json['schedule'] == []