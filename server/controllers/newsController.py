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

