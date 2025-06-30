from flask import Flask, jsonify
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv
from controllers.upload_controller import upload_image

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


@app.route("/upload", methods=["POST"])
def handle_upload():
    return upload_image()



if __name__ == "__main__":
    app.run(debug=True)
