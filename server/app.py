from gevent import monkey
monkey.patch_all()
import logging
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from routes import userRoute, tokenRoute, newsRoute
from flask import Flask
from config.app_config import create_app
from database.initDB import init_db
from database.db import db
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_socketio import SocketIO
from socketHandler.socket_handlers import init_socket

app, celery = create_app()
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
mongo = PyMongo(app)
socketio = SocketIO(app, cors_allowed_origins="*")
init_socket(socketio)

if __name__ == '__main__':
    init_db(app)
    # Configure logging
    logging.basicConfig(level=logging.DEBUG)

    # Use gevent WSGIServer with WebSocketHandler
    # socketio.run(app, debug=True, host='0.0.0.0', port=5000)
    http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
