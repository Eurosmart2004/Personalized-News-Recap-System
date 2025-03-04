from flask import Request, Response, jsonify, make_response
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
    

def embedding(request: Request) -> Response:
    data = request.get_json()
    text = data['text']

    try:
        embedding = newsService.get_embedding(text)
        return jsonify({
            'embedding': embedding
        })
    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 500)

def cluster(request: Request) -> Response:
    data = request.get_json()
    embeddings = data['embeddings']

    try:
        labels = newsService.cluster(embeddings)
        return jsonify({
            'labels': labels
        })
    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 500)


