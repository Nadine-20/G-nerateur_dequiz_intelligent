from flask import request, jsonify
from bson import ObjectId
from datetime import datetime

mongo = None
quizzes = None

def init_quiz_controller(mongo_instance):
    global mongo, quizzes
    mongo = mongo_instance
    quizzes = mongo.db["quizzes"]

def create_quiz():
    data = request.get_json()
    
    # Required fields validation
    required_fields = ["title", "createdBy", "subject", "questions"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"message": f"{field} is required"}), 400
    
    # Questions validation
    if len(data["questions"]) == 0:
        return jsonify({"message": "At least one question is required"}), 400
    
    # Create quiz document
    quiz = {
        "title": data["title"],
        "description": data.get("description", ""),
        "createdBy": data["createdBy"],
        "createdAt": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "isPublic": data.get("isPublic", False),
        "subject": data["subject"],
        "topics": data.get("topics", []),
        "difficulty": data.get("difficulty", "medium"),
        "timeLimit": data.get("timeLimit", 1800),  # Default 30 minutes
        "maxScore": data.get("maxScore", 100),
        "questions": data["questions"],
        "attempts": []  # Initialize empty attempts array
    }
    
    # Insert into database
    quizzes.insert_one(quiz)
    quiz["_id"] = str(quiz["_id"])  # Convert ObjectId to string
    
    return jsonify({
        "message": "Quiz created successfully",
        "quiz": quiz
    }), 201