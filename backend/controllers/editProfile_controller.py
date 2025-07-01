from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

mongo = None
users = None

def init_edit_profile_controller(mongo_instance):
    global mongo, users
    mongo = mongo_instance
    users = mongo.db["users"]

def edit_profile():
    data = request.get_json()
    user = users.find_one({"email": data.get("email")})
    if not user:
        return jsonify({"message": "User not found"}), 400

    update_data = {
        "firstName": data.get("firstName"),
        "lastName": data.get("lastName"),
        "image": data.get("profilePicture"),
    }
    if data.get("currentPassword") and data.get("newPassword") and data.get("confirmPassword"):
        if check_password_hash(user["password"], data.get("currentPassword")):
            if data.get("newPassword") == data.get("confirmPassword"):
                hashed_password = generate_password_hash(data.get("newPassword"))
                update_data["password"] = hashed_password
            else:
                return jsonify({"message": "New passwords do not match"}), 400
        else:
            return jsonify({"message": "Current password is incorrect"}), 400

    if update_data:
        users.update_one({"email": data.get("email")}, {"$set": update_data})

    return jsonify({"message": "Profile updated successfully"}), 200