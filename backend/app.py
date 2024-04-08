from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from flask_cors import CORS
# from dotenv import load_dotenv


# Load environment variables
# load_dotenv()
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

    db = client['Users']
    user_collection = db[form_username] # get the collection

    user_data = user_collection.find_one({"password" : {"$exists": True}}) # get the document
    # Check if the username exists in the database

    if user_data:
        # Check if the password is correct
        stored_password_encrypted = user_data.get('password')
        if decrypt(stored_password_encrypted, 1, 1) == (form_password):
            return jsonify({"message": "Login succesful"}), 200
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
    
    colNames = client['Users'].list_collection_names()
    if form_username in colNames:
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
def joinProject():
    data = request.get_json()
    formProjectID = data.get('joinProjectId')
    formUserID = data.get('currentUsername')
    #formUserID = "Hirsch"

    if not formProjectID or not formUserID:
        return jsonify({"message": "Project ID and User ID required"}), 400
    
    
    # Check if the projectID exists in Projects Database
    projectsDB = client.get_database("Projects")
    projectCollectionList = projectsDB.list_collection_names()
    if formProjectID not in projectCollectionList:
        return jsonify({"message": "Project ID does not exist"}), 400
    
    # Check if the user is already in the project
    usersDB = client.get_database("Users")
    userCollection = usersDB[formUserID]
    if userCollection.count_documents({"projectID": formProjectID}) > 0:
        return jsonify({"message": "User already in project"}), 400
    
    # If not in the project, add project to user
    userCollection.insert_one({
        "projectID": formProjectID,
        "HWSet1CheckedOut": 0,
        "HWSet2CheckedOut": 0,
    })

    return jsonify({"message": "User joined project successfully"}), 201


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
    userID = request.args.get('userName')
    project_details = []

    # Query the "Users" database
    user_db = client["Users"]
    user_collection = user_db[userID]
    user_docs = user_collection.find({"projectID" : {"$exists" : True}})

    #Iterate through user documents to find project IDs
    for doc in user_docs:
        project_id = doc["projectID"]
        projects_db = client["Projects"]
        project_collection = projects_db[project_id]
        project_doc = project_collection.find_one()

        if project_doc:
            project_details.append({
                "projectID" : project_id,
                "projectName" : project_doc.get("projectName"),
                "projectDescription" : project_doc.get("projectDescription")
            })

    return jsonify({"projectIDs": project_details}), 200


@app.route('/availability/<projectID>', methods=['GET'])
def get_availability(projectID):
    projects_db = client["Projects"]
    project_collection = projects_db[projectID]
    project_doc = project_collection.find_one()

    if project_doc:
        # Directly use the integer values of HWSet1Available and HWSet2Available
        availability = {
            "HWSet1Available": project_doc.get("HWSet1Available", 0),
            "HWSet2Available": project_doc.get("HWSet2Available", 0)
        }
        return jsonify(availability), 200
    else:
        return jsonify({"message": "Project not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
 