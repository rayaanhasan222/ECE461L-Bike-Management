from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from flask_cors import CORS
import os
from dotenv import load_dotenv


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

#encrypt and decrpt functions
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

    dbNames = client['Users'].list_collection_names()
    # Check if the username exists in the database
    if form_username in dbNames:
        # Check if the password is correct
        col = client['Users'][form_username]
        pwd = col.find_one('password')['password']
        if decrypt(pwd, 1, 1) == (form_password):
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
    
    dbNames = client['Users'].list_collection_names()
    if form_username in dbNames:
        return jsonify({"message": "User already exists"}), 400
    else: 
        col = client['Users'][form_username]  # Create a new collection with the username
        col.insert_one({"password": hashed_password})
        return jsonify({"message": "User registered successfully"}), 201

@app.route('/create', methods=['POST'])
def createProject():
    data = request.get_json()
    formProjectName = data.get('enterProjectName')
    formProjectID = data.get('enterProjectID')
    formProjectDescription = data.get('enterProjectDescription')

    if not formProjectName or not formProjectID or not formProjectDescription:
        return jsonify({"message": "Project name, ID, and description required"}), 400
    else:
        # Check if the projectID already exists
        projectsDB = client.get_database("Projects")
        collectionNames = projectsDB.list_collection_names()
        if formProjectID in collectionNames:
            return jsonify({"message": "Project ID already exists"}), 400
        else:
            # Create a new collection for the projectID
            projectCollection = projectsDB[formProjectID]
            projectCollection.insert_one({
                "HWSet1Available": 100,
                "HWSet2Available": 100,
                "projectName": formProjectName,
                "projectDescription": formProjectDescription
            })
            return jsonify({"message": "Project created successfully"}), 201
        
@app.route('/join', methods=['POST'])
def joinProject(projectId):
    data = request.get_json()
    formProjectID = data.get('joinProjectId')
    formUserID = data.get('UserId')

    if not formProjectID or not formUserID:
        return jsonify({"message": "Project ID and User ID required"}), 400
    
    else: 
        # Check if the projectID exists
        projectsDB = client.get_database("Projects")
        collectionNames = projectsDB.list_collection_names()
        if formProjectID not in collectionNames:
            return jsonify({"message": "Project ID does not exist"}), 400
        else:
            # Check if the user already exists in the project
            projectCollection = projectsDB[formProjectID]
            if projectCollection.count_documents({"users": formUserID}) > 0:
                return jsonify({"message": "User already in project"}), 400
            else:
                projectCollection.update_one({"users": formUserID})
                return jsonify({"message": "User joined project successfully"}), 201




    return jsonify({
        "projectId": projectId,
        "message": f"Joined project {projectId}"
    })



@app.route('/checkin/<projectId>', methods=['POST'])
def checkIn_hardware(projectId):
    qty = request.args.get('qty', type=int)
    userid = request.args.get('userid', type=str)
    hwSet = request.args.get('hwSet', type=str)
    userAmt = client['Users'][userid].find_one(projectId)[hwSet + 'CheckedOut']
    if(qty>userAmt):
        return jsonify({
        "message": f"Error: You only have {userAmt} quantity"
    })

    client['Users'][userid].find_one(projectId)[hwSet + 'CheckedOut'] = client['Users'][userid].find_one(projectId)[hwSet + 'CheckedOut']-qty
    client["Projects"][projectId].find_one()[hwSet + 'Available'] = client["Projects"][projectId].find_one()[hwSet + 'Available']+qty
    name = client["Projects"][projectId].find_one()['projectName']
    return jsonify({
        "projectId": projectId,
        "quantity": qty,
        "message": f"{qty} hardware checked in for {hwSet} in project {name}"
    })

@app.route('/checkout/<projectId>', methods=['POST'])
def checkOut_hardware(projectId):
    qty = request.args.get('qty', type=int)
    userid = request.args.get('userid', type=str)
    hwSet = request.args.get('hwSet', type=str)
    availability = client['Projects'][projectId].find_one()[hwSet + 'Available']
    if(qty>availability):
        return jsonify({
        "message": f"Error: Only {availability} available for checkout"
    })

    client['Users'][userid].find_one(projectId)[hwSet + 'CheckedOut'] = client['Users'][userid].find_one(projectId)[hwSet + 'CheckedOut']+qty
    client["Projects"][projectId].find_one()[hwSet + 'Available'] = client["Projects"][projectId].find_one()[hwSet + 'Available']-qty
    name = client["Projects"][projectId].find_one()['projectName']
    return jsonify({
        "projectId": projectId,
        "quantity": qty,
        "message": f"{qty} hardware checked out for {hwSet} in project {name}"
    })


@app.route('/leave/<projectId>', methods=['POST'])
def leaveProject(projectId):
    return jsonify({
        "projectId": projectId,
        "message": f"Left project {projectId}"
    })




@app.route('/projectsJoined', methods=['GET'])
def projectsJoined():
    username = request.args.get('userName')
    project_ids = []

    # Query the "AllProjects" database
    db = client["AllProjects"]

    # Iterate over each project collection
    for collection_name in db.list_collection_names():
        collection = db[collection_name]
        
        # Check if the username is in the array of users for the project
        if collection.count_documents({"users": username}) > 0:
            project_ids.append(collection_name)

    return jsonify({"projectIDs": project_ids}), 200









if __name__ == '__main__':
    app.run(debug=True)






 