from pymongo import MongoClient

CONNECTION_STRING = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.5"
client = MongoClient("mongodb://localhost:27017")

db = client["mydatabase"]
col = db["users"]

user1 = {"userid": "Tom", "pwd": "password"}

temp = col.insert_one(user1)
for x in col.find():
    print(x)