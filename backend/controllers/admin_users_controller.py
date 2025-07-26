from flask import request, jsonify
from bson import ObjectId
from datetime import datetime
from werkzeug.security import generate_password_hash

def init_user_routes(app, mongo):
    @app.route('/users', methods=['GET'])
    def get_all_users():
        try:
            users = list(mongo.db.users.find({}, {'password': 0}))
            for user in users:
                user['_id'] = str(user['_id'])
            return jsonify(users)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/users/<user_id>', methods=['GET'])
    def get_user(user_id):
        try:
            if not ObjectId.is_valid(user_id):
                return jsonify({"error": "Invalid user ID"}), 400
            
            user = mongo.db.users.find_one(
                {"_id": ObjectId(user_id)},
                {'password': 0}
            )
            
            if not user:
                return jsonify({"error": "User not found"}), 404
                
            user['_id'] = str(user['_id'])
            return jsonify(user)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/users', methods=['POST'])
    def create_user():
        try:
            data = request.get_json()
            required_fields = ['firstName', 'lastName', 'email', 'password', 'role']
            
            for field in required_fields:
                if not data.get(field):
                    return jsonify({"error": f"Missing required field: {field}"}), 400
            
            if mongo.db.users.find_one({"email": data['email']}):
                return jsonify({"error": "Email already exists"}), 400
            
            hashed_password = generate_password_hash(data['password'])
            
            new_user = {
                "firstName": data['firstName'],
                "lastName": data['lastName'],
                "email": data['email'],
                "password": hashed_password,  
                "role": data['role'],
                "gender": data.get('gender', ''),
                "matiere": data.get('matiere', ''),
                "createdAt": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                "date": datetime.now().strftime("%d/%m/%y"),
                "quizHistory": [],
                "customQuizzes": [],
                "lastConnect": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
            }
            
            result = mongo.db.users.insert_one(new_user)
            new_user['_id'] = str(result.inserted_id)
            del new_user['password']  
            
            return jsonify(new_user), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/users/<user_id>', methods=['PUT'])
    def update_user(user_id):
        try:
            if not ObjectId.is_valid(user_id):
                return jsonify({"error": "Invalid user ID"}), 400
            
            data = request.get_json()
            update_data = {}
            
            updatable_fields = [
                'firstName', 'lastName', 'gender', 
                'matiere', 'lastConnect'
            ]
            
            for field in updatable_fields:
                if field in data:
                    update_data[field] = data[field]
            
            if 'email' in data:
                if mongo.db.users.find_one({"email": data['email'], "_id": {"$ne": ObjectId(user_id)}}):
                    return jsonify({"error": "Email already in use"}), 400
                update_data['email'] = data['email']
            
            if 'password' in data and data['password']:
                # Hash the new password if provided
                update_data['password'] = generate_password_hash(data['password'])
            
            if not update_data:
                return jsonify({"error": "No valid fields to update"}), 400
            
            result = mongo.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            if result.matched_count == 0:
                return jsonify({"error": "User not found"}), 404
            
            return jsonify({"message": "User updated successfully"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/users/<user_id>', methods=['DELETE'])
    def delete_user(user_id):
        try:
            if not ObjectId.is_valid(user_id):
                return jsonify({"error": "Invalid user ID"}), 400
            
            mongo.db.quizzes.delete_many({"createdBy": ObjectId(user_id)})
            
            result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})
            
            if result.deleted_count == 0:
                return jsonify({"error": "User not found"}), 404
            
            return jsonify({"message": "User deleted successfully"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500