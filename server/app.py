import logging
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from routes import userRoute, tokenRoute, newsRoute, favoriteRoute
from flask import Flask
from config.app_config import create_app
from database.initDB import init_db
from database.database import db
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
import os

app, celery = create_app()
cors = CORS(app, resources={r"/*": {"origins": ["*", os.getenv("CLIENT_URL")]}}, supports_credentials=True)
mongo = PyMongo(app)

if __name__ == '__main__':
    init_db(app)
    # Configure logging
    logging.basicConfig(level=logging.DEBUG)

    http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
