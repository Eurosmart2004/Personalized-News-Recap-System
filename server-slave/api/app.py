from flask import Flask, request, jsonify

from gevent.pywsgi import WSGIServer
app = Flask(__name__)

from routes import *

if __name__ == "__main__":
    http_server = WSGIServer(('', 7000), app)
    http_server.serve_forever()