#!/usr/bin/env python3
import sys
sys.path.append('.')
from app import mongo
from werkzeug.security import generate_password_hash

def update_user_passwords():
    users_collection = mongo.db["users"]
    
    # Generate new password hash for "password123"
    new_password_hash = generate_password_hash("password123")
    
    # Update the original users
    original_users = ["user_001", "user_002", "user_003"]
    
    for user_id in original_users:
        result = users_collection.update_one(
            {"_id": user_id},
            {"$set": {"password": new_password_hash}}
        )
        print(f"Updated user {user_id}: {result.modified_count} document(s) modified")
    
    print("Password update completed!")

if __name__ == "__main__":
    update_user_passwords()
