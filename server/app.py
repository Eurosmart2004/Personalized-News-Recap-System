from gevent.pywsgi import WSGIServer
from routes import userRoute, tokenRoute, newsRoute
from flask import Flask
from config.app_config import create_app
from database.initDB import init_db
from database.db import db
from flask_pymongo import PyMongo
from flask_cors import CORS
app, celery = create_app()
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
mongo = PyMongo(app)
if __name__ == '__main__':
    init_db(app)
    
    app.run(port=5000, debug=True)
    # http_server = WSGIServer(('', 5000), app)
    # http_server.serve_forever()
