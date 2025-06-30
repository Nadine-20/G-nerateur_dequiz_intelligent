from flask import Flask, jsonify
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv

load_dotenv() 
app = Flask(__name__)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")

mongo = PyMongo(app)
db = mongo.db  

try:
    mongo.cx.admin.command('ping')  
    print("✅ MongoDB connected successfully.")
except Exception as e:
    print("❌ MongoDB connection failed:", e)





if __name__ == "__main__":
    app.run(debug=True)
