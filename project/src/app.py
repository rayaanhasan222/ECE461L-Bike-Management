from flask import Flask, request, jsonify;
from pymongo import MongoClient;
import os;


client = MongoClient("mongodb+srv://njoopelli:BikeMgmt9203@cluster0.x9xuspc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["loginDatabase"]
collection = db["credentials"]

flask_app = Flask(__name__, static_folder='./build', static_url_path='/')

@flask_app.route('/', methods=["GET"])
def index():
    return flask_app.send_static_file('index.html')

@flask_app.route('/', methods = ["POST"])
def login():
    username = request.get("username")
    password = request.get("password")

    user = collection.find_one({'username': username, 'password': password})
    if user:
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        collection.insert_one({'username': username, 'password': password})
        return jsonify({'success': False, 'message': 'Account created'})

@flask_app.errorhandler()
def not_found(e):
    return

flask_app.send_static_file('index.html')

if __name__ == "__main__":
    flask_app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))