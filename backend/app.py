from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# MongoDB connection setup
password = os.environ.get("MONGO_PWD")
username = "jfang875" # Replace with your MongoDB username
database_name = "Users" # Replace with your database name
cluster_url = "ece461l.z5hssf5.mongodb.net"

# Ensure you replace 'mydatabase' with your actual database name in the connection string
# connection_string = f"mongodb+srv://{username}:{password}@{cluster_url}/{database_name}?retryWrites=true&w=majority"
connection_string = f"mongodb+srv://jfang875:eIMG6XdAH0e1chGD@ece461l.z5hssf5.mongodb.net/Users?retryWrites=true&w=majority&w=majority"

app.config["MONGO_URI"] = connection_string
try:
    mongo = PyMongo(app)
    db = mongo.db
    dummy_username = "Jim"
    dummy_password = "1234"
    dummy_hashed_password = generate_password_hash(dummy_password)
    dummy_user = {
        "username": dummy_username,
        "password": dummy_hashed_password
    }
    db["profile-information"].insert_one(dummy_user)
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")



@app.route('/')
def default():
    return 'Default route of the Flask application'

@app.route('/home')
def home():
    return 'Home Page content'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Login logic here
        return 'Login logic to be implemented'
    return 'Login Page'

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    form_username = data.get('username')
    form_password = data.get('password')

    if not form_username or not form_password:
        return jsonify({"error": "Username and password required"}), 400

    hashed_password = generate_password_hash(form_password)
    user_collection = db['profile-information']
    user_collection.insert_one({
        'username': form_username,
        'password': hashed_password
    })

    return jsonify({"message": "User registered successfully"}), 201


@app.route('/database')
def database():
    user_collection = db['profile-information']
    users = user_collection.find({}, {'_id': 0, 'username': 1})
    user_list = [user['username'] for user in users]
    print(user_list)  # Log the user list 
    return jsonify(user_list)


@app.route('/checkin/<projectId>', methods=['POST'])
def checkIn_hardware(projectId):
    qty = request.args.get('qty', type=int)
    return jsonify({
        "projectId": projectId,
        "quantity": qty,
        "message": f"{qty} hardware checked in for project {projectId}"
    })

@app.route('/checkout/<projectId>', methods=['POST'])
def checkOut_hardware(projectId):
    qty = request.args.get('qty', type=int)
    return jsonify({
        "projectId": projectId,
        "quantity": qty,
        "message": f"{qty} hardware checked out for project {projectId}"
    })

@app.route('/join/<projectId>', methods=['POST'])
def joinProject(projectId):
    return jsonify({
        "projectId": projectId,
        "message": f"Joined project {projectId}"
    })

@app.route('/leave/<projectId>', methods=['POST'])
def leaveProject(projectId):
    return jsonify({
        "projectId": projectId,
        "message": f"Left project {projectId}"
    })

if __name__ == '__main__':
    app.run(debug=True)