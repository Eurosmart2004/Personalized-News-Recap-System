from flask import Flask
from flask.testing import FlaskClient


def test_get_cluster(client: FlaskClient, auth_headers):
    response = client.get('/api/cluster/week', headers=auth_headers, query_string={})

    assert response.status_code == 200
    assert 'clusters' in response.json
