import sys
import os
# Add the project root to the sys.path to allow module imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from dotenv import load_dotenv
import pytest
from config.app_config import create_app
from models import *
from database.database import db
from flask.testing import FlaskClient

load_dotenv()

@pytest.fixture(scope="session")
def app():
    # Create the Flask app using your factory function and set TESTING mode
    app, _ = create_app()
    app.config.update({"TESTING": True})
    yield app

    # Clean up the database after each test
    with app.app_context():
        user: User = db.session.query(User).filter_by(email="lequangthien@yopmail.com").first()
        db.session.query(FavoriteCollection).delete()
        db.session.query(Token).filter_by(user_id=user.id).delete()
        db.session.query(UserPreference).filter_by(user_id=user.id).delete()
        db.session.query(UserSchedule).filter_by(user_id=user.id).delete()
        db.session.delete(user)
        db.session.commit()
        
        

@pytest.fixture(scope="session")
def client(app) -> FlaskClient:
    # Return a test client for the Flask app
    return app.test_client()

@pytest.fixture(scope="session")
def access_token(client: FlaskClient):
    """Log in the test user and return the access token and cookies."""
    response = client.post('/api/user/login', json={
        'email': 'lequangthien@yopmail.com',
        'password': '*Abcdef123456'
    })
    
    # Extract access token from JSON response
    access_token = response.json['accessToken']
    
    # Extract cookies from the response
    cookies = response.headers.getlist('Set-Cookie')

    return access_token, cookies


@pytest.fixture(scope="session")
def auth_headers(access_token):
    """Provide authentication headers for requests, including cookies."""
    token, cookies = access_token  # Unpack token and cookies

    # Convert cookies to a single header string
    cookie_header = "; ".join([cookie.split(";")[0] for cookie in cookies])  # Keep only "key=value"

    return {
        "Authorization": f"Bearer {token}",
        "Cookie": cookie_header  # Attach cookies properly formatted
    }
