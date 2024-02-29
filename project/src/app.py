from flask import Flask,jsonify;
import os;
from pymongo import MongoClient


flask_app = Flask(__name__, static_folder='./build', static_url_path='/')

@flask_app.route('/', methods=["GET"])
def index():
    return flask_app.send_static_file('index.html')

@flask_app.errorhandler()
def not_found(e):
    return

flask_app.send_static_file('index.html')

if __name__ == "__main__":
    flask_app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))