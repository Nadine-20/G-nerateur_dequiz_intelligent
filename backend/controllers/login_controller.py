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
    if not data or "email" not in data or "password" not in data:
        return jsonify({"message": "Email and password are required."}), 400

    user = users.find_one({"email": data.get("email")})
    if not user:
        return jsonify({"message": "Invalid email or password."}), 401

    if not check_password_hash(user["password"], data.get("password")):
        return jsonify({"message": "Invalid email or password."}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": str(user["_id"]),
        "email": user["email"]
    }), 200