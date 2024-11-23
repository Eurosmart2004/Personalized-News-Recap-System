from flask import Flask
from routes import userRoute, tokenRoute, newsRoute, preferenceRoute
from server.database.database import db
from flask_socketio import SocketIO
from server.sio import sio
from .celery_config import make_celery
from .config import DevConfig, ProdConfig
from dotenv import load_dotenv
import os
load_dotenv()
env = os.getenv('FLASK_ENV', 'development')
Config = None
if env == 'production':
    Config = ProdConfig
else:
    Config = DevConfig

socketIO = SocketIO()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = Config.SQLALCHEMY_TRACK_MODIFICATIONS
    app.config['MONGO_URI'] = Config.MONGO_URI
    app.config['GOOGLE_CLIENT_ID'] = Config.GOOGLE_CLIENT_ID
    app.config['GOOGLE_CLIENT_SECRET'] = Config.GOOGLE_CLIENT_SECRET
    app.config['CELERY_CONFIG'] = { 
        'broker_url': Config.broker_url,
        'result_backend': Config.result_backend,
        'broker_connection_retry_on_startup': True,
        'timezone': Config.timezone,
        'enable_utc': Config.enable_utc,
        'beat_schedule': Config.beat_schedule,
        'task_routes': Config.task_routes,
    }

    celery = make_celery(app)
    db.init_app(app)

    socketIO.init_app(app, cors_allowed_origins="*")
    sio.init(socketIO)
    userRoute.init(app)
    tokenRoute.init(app)
    newsRoute.init(app)
    preferenceRoute.init(app)
    return app, celery
