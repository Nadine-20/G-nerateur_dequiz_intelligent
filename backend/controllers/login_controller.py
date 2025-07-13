from flask import request, jsonify
from werkzeug.security import check_password_hash

mongo = None
users = None

def init_login_controller(mongo_instance):
    global mongo, users
    mongo = mongo_instance
    users = mongo.db["users"]

def login():
    data = request.get_json()
    print(f"Login attempt with data: {data}")
    
    if not data or "email" not in data or "password" not in data:
        print("Missing email or password")
        return jsonify({"message": "Email and password are required."}), 400

    email = data.get("email")
    password = data.get("password")
    print(f"Searching for user with email: {email}")

    user = users.find_one({"email": email})
    if not user:
        print(f"User not found with email: {email}")
        return jsonify({"message": "Invalid email or password."}), 401

    print(f"User found: {user.get('email')} - ID: {user.get('_id')}")
    print(f"Stored password hash: {user.get('password')}")
    
    if not check_password_hash(user["password"], password):
        print(f"Password check failed for user: {email}")
        return jsonify({"message": "Invalid email or password."}), 401

    print(f"Login successful for user: {email}")
    return jsonify({
        "message": "Login successful",
        "_id": str(user.get("_id", "")),
        "firstName": user.get("firstName", ""),
        "lastName":  user.get("lastName", ""),
        "email": user.get("email", ""),
        "role": user.get("role", ""),
    }), 200
