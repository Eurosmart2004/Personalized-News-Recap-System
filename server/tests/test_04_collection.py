from flask import Flask
from flask.testing import FlaskClient


def test_get_collection(client: FlaskClient, auth_headers):
    response = client.get('/api/collection', headers=auth_headers, query_string={})

    assert response.status_code == 200
    assert 'collections' in response.json

def test_create_collection(client: FlaskClient, auth_headers):
    response = client.post('/api/collection', headers=auth_headers, json={
        "name": "Test Collection",
    })

    assert response.status_code == 201
    assert 'collections' in response.json

    assert any(collection["collection"]["name"] == "Test Collection" for collection in response.json["collections"])

def test_update_collection(client: FlaskClient, auth_headers):
    response = client.get('/api/collection', headers=auth_headers, query_string={})

    collection = response.json["collections"][0]

    response = client.put('/api/collection', headers=auth_headers, json={
        "collection_id": collection["collection"]["id"],
        "name": "Updated Collection",
    })

    assert response.status_code == 200
    assert 'collections' in response.json

    assert any(collection["collection"]["name"] == "Updated Collection" for collection in response.json["collections"])

def test_delete_collection(client: FlaskClient, auth_headers):
    
    response = client.get('/api/collection', headers=auth_headers, query_string={})

    collection_id = response.json["collections"][0]["collection"]["id"]

    response = client.delete('/api/collection', headers=auth_headers, json={
        "collection_id": collection_id,
    })

    assert response.status_code == 200
    assert 'collections' in response.json
    assert not any(collection_id == collection["collection"]["id"] for collection in response.json["collections"])