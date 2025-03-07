from flask import Flask
from flask.testing import FlaskClient

def test_get_news(client: FlaskClient, auth_headers):
    response = client.get('/api/news/get', headers=auth_headers, query_string={
        "limit": 10
    })

    assert response.status_code == 200
    assert 'news' in response.json
    
    assert len(response.json['news']) == 10
    keys = ["id", "image", "link", "summary", "date", "title", "topic"]
    for n in response.json['news']:
        for k in keys:
            assert k in n

    response2 = client.get('/api/news/get', headers=auth_headers, query_string={
        "limit": 10,
        "before_time": response.json["news"][-1]["date"],
        "after_time": response.json["news"][0]["date"]
    })

    assert response2.status_code == 200
    assert 'news' in response2.json
    assert len(response2.json['news']) == 10
    for n in response2.json['news']:
        for k in keys:
            assert k in n