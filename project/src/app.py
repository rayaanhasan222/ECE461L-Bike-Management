from flask import Flask, request, jsonify;
from pymongo import MongoClient;
import os;



client = MongoClient("mongodb+srv://njoopelli:BikeManagement9203@cluster0.x9xuspc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.get_database("loginDatabase")
collection = db["credentials"]

flask_app = Flask(__name__, static_folder='/src', static_url_path='/')

@flask_app.route('/', methods=["GET"])
def index():
    return flask_app.send_static_file('index.html')

@flask_app.route('/', methods = ["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    user = collection.find_one({'username': username, 'password': password})
    if user:
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        collection.insert_one({'username': username, 'password': password})
        return jsonify({'success': False, 'message': 'Account created'})

@flask_app.errorhandler(Exception)
def not_found(e):
    return

if __name__ == "__main__":
    flask_app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))



