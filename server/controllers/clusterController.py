from flask import Request, Response, jsonify, make_response
from services import clusterService
import logging

def get_cluster(request: Request, duration: str) -> Response:
    if duration not in ['day', 'week', 'month']:
        return make_response(jsonify({'error': 'Invalid duration'}), 400)
    try:
        list_clusters = clusterService.get_cluster(duration)
        return make_response(jsonify({
            'message': 'Cluster retrieved successfully',
            'clusters': list_clusters
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)