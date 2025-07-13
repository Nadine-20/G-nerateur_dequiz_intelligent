#!/usr/bin/env python3
from werkzeug.security import generate_password_hash
from pymongo import MongoClient
import os

def update_user_passwords():
    # Connect to MongoDB
    client = MongoClient(os.getenv('MONGODB_URI'))
    db = client['quiz_intelligent_db']
    users_collection = db['users']
    
    # Generate new password hash for "password123"
    new_password_hash = generate_password_hash("password123")
    
    # First, let's see what users exist
    users = list(users_collection.find({}, {"_id": 1, "email": 1}))
    print("Found users:")
    for user in users:
        print(f"  ID: {user['_id']}, Email: {user.get('email', 'No email')}")
    
    # Update all users to have password123
    result = users_collection.update_many(
        {},  # Match all users
        {"$set": {"password": new_password_hash}}
    )
    print(f"Updated {result.modified_count} users with new password")
    
    client.close()
    print("Password update completed!")

if __name__ == "__main__":
    update_user_passwords()
