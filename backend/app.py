from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from flask_cors import CORS
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv
from werkzeug.security import check_password_hash


# Load environment variables
load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all domains




# 1 Opens a connection to the Cluster
uri = "mongodb+srv://jfang875:eIMG6XdAH0e1chGD@ece461l.z5hssf5.mongodb.net/Users?retryWrites=true&w=majority&w=majority"
# Create a new client and connect to the server/cluster
client = MongoClient(uri)

# Send a ping to confirm connection
try:
  client.admin.command('ping')
  print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
  print(e)

# Dummy code
"""
MongoDB connection setup
password = os.environ.get("MONGO_PWD")
username = "jfang875" # Replace with your MongoDB username
database_name = "Users" # Replace with your database name
cluster_url = "ece461l.z5hssf5.mongodb.net"

connection_string = f"mongodb+srv://{username}:{password}@{cluster_url}/{database_name}?retryWrites=true&w=majority"
connection_string = f"mongodb+srv://jfang875:eIMG6XdAH0e1chGD@ece461l.z5hssf5.mongodb.net/Users?retryWrites=true&w=majority&w=majority"


app.config["MONGO_URI"] = connection_string
try:
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
"""




def encrypt(text, n, direction):
    if direction != -1 and direction != 1:
        print(direction)
        print("Invalid direction");
        return -1
    if n < 1:
        print("Invalid, n must be greater than or equal to 1")
        return -1

    while text.find("!") != -1:
        text = text.replace("!", "")

    while text.find(" ") != -1:
        text = text.replace(" ", "")

    reversed = text[::-1]

    encrypted = ""
    for i in range(len(reversed)):
        char = ord(reversed[i])
        if 34 <= char <= 126:
            char = (char - 34 + (direction * n)) % 93 + 34
            encrypted = encrypted + chr(char)

    #print("encrypted: " + encrypted)
    return encrypted

def decrypt(text, n, d):
    decrypted = ""
    for i in range(len(text)):
        char = ord(text[i])
        char = (char - 34 + (-d * n)) % 93 + 34
        #rint("encrypted char:", char)
        decrypted = decrypted + chr(char)
    decrypted = decrypted[::-1]

    #print("decrypted: " + decrypted)
    return decrypted


# API endpoints
@app.route('/')
def default():
    return 'Default route of the Flask application'


@app.route('/home')
def home():
    return 'Home Page content'
    

@app.route('/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    form_username = data.get('username')
    form_password = data.get('password')
    if not form_username or not form_password:
        return jsonify({"message": "Username and password required"}), 400

    dbNames = client.list_database_names()
    # Check if the username exists in the database
    if form_username in dbNames:
        # Check if the password is correct
        db = client[form_username]
        info = db['Info']
        if decrypt(info.find_one()['password'], 1, 1) == (form_password):
            return jsonify({"message": "Login succesful"}), 400
        else:
            return jsonify({"message": "Wrong Password"}), 400
    else:
        return jsonify({"message": "User Doesn't Exist"}), 400
    
       

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    form_username = data.get('username')
    form_password = data.get('password')

    if not form_username or not form_password:
        return jsonify({"message": "Username and password required"}), 400

    hashed_password = encrypt(form_password, 1, 1)#encrypt with N and D

    # Check if database with the same username already exists
    
    dbNames = client.list_database_names()
    if form_username in dbNames:
        return jsonify({"message": "User already exists"}), 400
    else: 
        db = client[form_username]  # Create a new database with the username
        col = db['Info']
        col.insert_one({"password": hashed_password})
        return jsonify({"message": "User registered successfully"}), 201


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






 