from flask import Flask, request, make_response, jsonify
from middleware.auth import authentication
from .config import ROUTE
import logging

route = ROUTE['cluster']

def init(app: Flask):
    from controllers import clusterController
    @app.route(f'{route}/<duration>', methods=['GET'])
    @authentication
    def get_cluster(duration):
        return clusterController.get_cluster(request, duration)
    
    @app.route(f'{route}', methods=['GET'])
    @authentication
    def get_cluster_default():
        return clusterController.get_cluster_id(request)
