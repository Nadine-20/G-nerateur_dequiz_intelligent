from flask import request, jsonify
from bson import ObjectId
from datetime import datetime

mongo = None
quizzes = None
users = None  

def init_quiz_controller(mongo_instance):
    global mongo, quizzes, users
    mongo = mongo_instance
    quizzes = mongo.db["quizzes"]
    users = mongo.db["users"]  


def create_quiz():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        created_by_str = data.get("createdBy")
        if not created_by_str or not ObjectId.is_valid(created_by_str):
            return jsonify({
                "error": "Invalid teacher ID format",
                "message": "Teacher ID must be a valid 24-character MongoDB ObjectId string"
            }), 400

        teacher_id = ObjectId(created_by_str)

        required_fields = ["title", "subject", "questions"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400

        if not isinstance(data["questions"], list) or len(data["questions"]) == 0:
            return jsonify({"error": "At least one question is required"}), 400

        quiz = {
            "title": data["title"],
            "description": data.get("description", ""),
            "createdBy": teacher_id,
            "createdAt": datetime.utcnow(),
            "isPublic": data.get("isPublic", False),
            "subject": data["subject"],
            "topics": data.get("topics", []),
            "difficulty": data.get("difficulty", "medium"),
            "timeLimit": data.get("timeLimit", 1800),
            "maxScore": data.get("maxScore", 100),
            "questions": data["questions"],
            "attempts": []
        }

        result = quizzes.insert_one(quiz)
        inserted_quiz_id = result.inserted_id

        update_result = users.update_one(
            {"_id": teacher_id},
            {"$push": {"customQuizzes": inserted_quiz_id}}
        )

        if update_result.matched_count == 0:
            quizzes.delete_one({"_id": inserted_quiz_id})
            return jsonify({
                "error": "Teacher not found",
                "message": "Quiz was created but couldn't find teacher to associate with"
            }), 404

        quiz["_id"] = str(inserted_quiz_id)
        quiz["createdBy"] = str(teacher_id)
        quiz["createdAt"] = quiz["createdAt"].strftime("%Y-%m-%dT%H:%M:%SZ")

        return jsonify({
            "message": "Quiz created and added to teacher's collection",
            "quiz": quiz
        }), 201

    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500
