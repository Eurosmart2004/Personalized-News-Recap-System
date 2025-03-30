from flask import Request, Response, jsonify, make_response, send_file
from services import newsService
from datetime import datetime
import asyncio

def summarize(request: Request) -> Response:
    article_ids = request.get_json()

    try:
        task_id = asyncio.run(newsService.hanhdle_summarize(article_ids))
        return make_response(jsonify({'message': 'Summarize task started', 'task_id': task_id}), 202)
    except Exception as e:
        return make_response(jsonify({'error': e}), 500)
    

def get_user_news(request: Request) -> Response:
    user_id = request.userID
    before_time = request.args.get("before_time")
    after_time = request.args.get("after_time")
    limit = request.args.get("limit")
    
    if limit is None:
        return jsonify({'error': 'Missing required field limit'}), 400
    
    
    try:
        news = newsService.get_user_news(user_id, before_time, after_time, int(limit))
        return jsonify({
            'news': news
        })
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    

def get_image(request: Request) -> Response:
    image_url = request.args.get("image_url")
    
    if image_url is None:
        return jsonify({'error': 'Missing required field image_id'}), 400
    
    try:
        image_bytes = newsService.get_image(image_url)
        return send_file(image_bytes, mimetype='image/jpeg')
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    

def get_favorite_news(request: Request) -> Response:
    user_id = request.userID
    try:
        news_query = newsService.get_favorite_news(user_id)
        return jsonify({
            'news_query': news_query,
            'message': 'News fetched successfully'
        })
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def post_favorite_news(request: Request) -> Response:
    user_id = request.userID
    query = request.get_json()['query']
    
    try:
        news_query = newsService.post_favorite_news(user_id, query)
        return jsonify({
            'message': 'News added to favorites',
            'news_query': news_query
            })
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)

def put_favorite_news(request: Request) -> Response:
    user_id = request.userID
    query_id = request.get_json()['query_id']
    new_query = request.get_json()['new_query']
    
    try:
        news_query = newsService.put_favorite_news(user_id, query_id, new_query)
        return jsonify({
            'message': 'News updated in favorites',
            'news_query': news_query
        })
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def delete_favorite_news(request: Request) -> Response:
    user_id = request.userID
    query_id = request.get_json()['query_id']
    
    try:
        news_query = newsService.delete_favorite_news(user_id, query_id)
        return jsonify({
            'message': 'News deleted from favorites',
            'news_query': news_query
        })
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def search_news(request: Request) -> Response:
    userID = request.userID
    searchs = request.get_json()['searchs']
    try:
        news = newsService.search_news(userID, searchs)
        return jsonify({
            'news': news
        })
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)