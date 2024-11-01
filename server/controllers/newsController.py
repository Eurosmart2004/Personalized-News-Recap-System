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
    

