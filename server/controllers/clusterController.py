from flask import Request, Response, jsonify, make_response
from services import clusterService
from datetime import datetime
import pytz

import logging

def get_cluster(request: Request, duration: str) -> Response:
    if duration not in ['day', 'week', 'month']:
        return make_response(jsonify({'error': 'Invalid duration'}), 400)
    
    date_str = request.args.get('date')
    date = datetime.fromisoformat(date_str.replace('Z', '+00:00')).astimezone(pytz.timezone('Asia/Ho_Chi_Minh')) if date_str else datetime.now(pytz.timezone('Asia/Ho_Chi_Minh'))
    try:
        list_clusters = clusterService.get_cluster(duration, date)
        return make_response(jsonify({
            'message': 'Cluster retrieved successfully',
            'clusters': list_clusters
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    
def get_cluster_id(request: Request) -> Response:
    id = request.args.get('id')
    if not id:
        return make_response(jsonify({'error': 'Cluster ID is required'}), 400)
    
    try:
        cluster = clusterService.get_cluster_by_id(id)
        return make_response(jsonify({
            'message': 'Cluster retrieved successfully',
            'cluster': cluster
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)