from flask import Flask
from flask.testing import FlaskClient

def test_refresh_token(client: FlaskClient, auth_headers):
    response = client.post('/api/token/refresh', headers=auth_headers, json={})

    assert response.status_code == 200
    assert 'accessToken' in response.json
    cookies = response.headers.get('Set-Cookie')
    assert cookies is not None
    assert 'refreshToken=' in cookies