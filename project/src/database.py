import pymongo
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def input():
    return render_template('App.js')

if __name__ == '__main__':
    app.run()
myclient = pymongo.MongoClient("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.5")
mydb = myclient["users"]

mycol = mydb["usernames"]