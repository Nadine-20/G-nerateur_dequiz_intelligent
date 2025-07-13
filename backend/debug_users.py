#!/usr/bin/env python3
import sys
sys.path.append('.')
from app import mongo

def debug_users():
    users_collection = mongo.db["users"]
    
    # Check if we can connect and get users
    try:
        users = list(users_collection.find({}))
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"  ID: {user['_id']}, Email: {user.get('email', 'No email')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_users()
