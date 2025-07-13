from flask import request, jsonify
from werkzeug.security import generate_password_hash
from datetime import datetime
import re

mongo = None
users = None

def init_signup_controller(mongo_instance):
    global mongo, users
    mongo = mongo_instance
    users = mongo.db["users"]

def signup():
    data = request.get_json()
    
    required_fields = ["firstName", "lastName", "email", "password", "confirmPassword", "gender"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"message": f"{field} is required."}), 400

    if data["password"] != data["confirmPassword"]:
        return jsonify({"message": "Passwords do not match."}), 400

    if len(data["password"]) < 6:
        return jsonify({"message": "Password must be at least 6 characters."}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", data["email"]):
        return jsonify({"message": "Invalid email format."}), 400

    if data.get("role") == "student" and not data.get("niveau"):
        return jsonify({"message": "Grade level is required for students."}), 400
    if data.get("role") == "teacher" and not data.get("matiere"):
        return jsonify({"message": "Specialization is required for teachers."}), 400

    if users.find_one({"email": data["email"]}):
        return jsonify({"message": "Email already registered."}), 409

    user_data = {
        "firstName": data["firstName"],
        "lastName": data["lastName"],
        "email": data["email"],
        "password": generate_password_hash(data["password"]),
        "role": data.get("role", "student"),
        "gender": data["gender"],
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "date": datetime.now().strftime("%d/%m/%y"),
        "quizHistory": [],
        "customQuizzes": [],
        "lastConnect": datetime.utcnow().isoformat() + "Z"
    }

    if user_data["role"] == "student":
        user_data["niveau"] = data["niveau"]
    elif user_data["role"] == "teacher":
        user_data["matiere"] = data["matiere"]

    try:
        result = users.insert_one(user_data)
        user_data["_id"] = str(result.inserted_id)
        
        user_data.pop("password", None)
        user_data.pop("_id", None)
        
        return jsonify({
            "message": "Registration successful",
            "user": user_data
        }), 201
        
    except Exception as e:
        return jsonify({"message": "Registration failed. Please try again."}), 500
