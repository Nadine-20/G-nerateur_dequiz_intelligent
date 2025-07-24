from flask import Blueprint, jsonify
from bson import ObjectId
from datetime import datetime

mongo = None
quizzes = None
users = None

def init_my_quizzes_controller(mongo_instance):
    global mongo, quizzes, users
    mongo = mongo_instance
    quizzes = mongo.db["quizzes"]
    users = mongo.db["users"]

my_quizzes_bp = Blueprint('my_quizzes', __name__, url_prefix='/api/my-quizzes')

@my_quizzes_bp.route('/<teacher_id>', methods=['GET'])
def get_teacher_quizzes(teacher_id):
    try:
        try:
            teacher_oid = ObjectId(teacher_id)
        except:
            return jsonify({"error": "Invalid teacher ID format"}), 400

        teacher = users.find_one({"_id": teacher_oid})
        if not teacher:
            return jsonify({"error": "Teacher not found"}), 404

        quizzes_list = list(quizzes.find(
            {"createdBy": teacher_oid},
            {"questions": 0, "attempts": 0} 
        ).sort("createdAt", -1))

        for quiz in quizzes_list:
            quiz["_id"] = str(quiz["_id"])
            quiz["createdBy"] = str(quiz["createdBy"])
            quiz["createdAt"] = quiz["createdAt"].isoformat() + "Z"

        return jsonify(quizzes_list)

    except Exception as e:
        return jsonify({
            "error": "Failed to fetch quizzes",
            "details": str(e)
        }), 500

@my_quizzes_bp.route('/<quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    try:
        try:
            quiz_oid = ObjectId(quiz_id)
        except:
            return jsonify({"error": "Invalid quiz ID format"}), 400

        quiz = quizzes.find_one({"_id": quiz_oid})
        if not quiz:
            return jsonify({"error": "Quiz not found"}), 404

        result = quizzes.delete_one({"_id": quiz_oid})
        
        users.update_many(
            {"customQuizzes": quiz_oid},
            {"$pull": {"customQuizzes": quiz_oid}}
        )

        return jsonify({"message": "Quiz deleted successfully"})

    except Exception as e:
        return jsonify({
            "error": "Failed to delete quiz",
            "details": str(e)
        }), 500
    
from flask import Blueprint, jsonify, request  # Make sure request is imported
from bson import ObjectId
from datetime import datetime


@my_quizzes_bp.route('/<quiz_id>', methods=['PUT'])
def update_quiz(quiz_id):
    try:
        try:
            quiz_oid = ObjectId(quiz_id)
        except:
            return jsonify({"error": "Invalid quiz ID format"}), 400

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ["title", "subject", "questions"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        if not isinstance(data["questions"], list) or len(data["questions"]) == 0:
            return jsonify({"error": "At least one question is required"}), 400

        update_data = {
            "title": data["title"],
            "description": data.get("description", ""),
            "subject": data["subject"],
            "topics": data.get("topics", []),
            "difficulty": data.get("difficulty", "medium"),
            "timeLimit": int(data.get("timeLimit", 1800)),
            "maxScore": int(data.get("maxScore", 100)),
            "questions": data["questions"],
            "updatedAt": datetime.utcnow()
        }

        result = quizzes.update_one(
            {"_id": quiz_oid},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Quiz not found"}), 404

        updated_quiz = quizzes.find_one({"_id": quiz_oid})
        updated_quiz["_id"] = str(updated_quiz["_id"])
        updated_quiz["createdBy"] = str(updated_quiz["createdBy"])
        updated_quiz["createdAt"] = updated_quiz["createdAt"].isoformat() + "Z"
        if 'updatedAt' in updated_quiz:
            updated_quiz["updatedAt"] = updated_quiz["updatedAt"].isoformat() + "Z"

        return jsonify({
            "message": "Quiz updated successfully",
            "quiz": updated_quiz
        })

    except Exception as e:
        return jsonify({
            "error": "Failed to update quiz",
            "details": str(e)
        }), 500
    
@my_quizzes_bp.route('/quiz/<quiz_id>', methods=['GET'])
def get_single_quiz(quiz_id):
    try:
        try:
            quiz_oid = ObjectId(quiz_id)
        except:
            return jsonify({"error": "Invalid quiz ID format"}), 400

        quiz = quizzes.find_one({"_id": quiz_oid})
        if not quiz:
            return jsonify({"error": "Quiz not found"}), 404

        response_data = {
            "_id": str(quiz["_id"]),
            "title": quiz["title"],
            "description": quiz.get("description", ""),
            "subject": quiz["subject"],
            "topics": quiz.get("topics", []),
            "difficulty": quiz.get("difficulty", "medium"),
            "timeLimit": quiz.get("timeLimit", 1800),
            "maxScore": quiz.get("maxScore", 100),
            "questions": quiz.get("questions", []),
            "createdBy": str(quiz["createdBy"]),
            "createdAt": quiz["createdAt"].isoformat() + "Z"
        }
        
        if 'updatedAt' in quiz:
            response_data["updatedAt"] = quiz["updatedAt"].isoformat() + "Z"

        return jsonify(response_data)

    except Exception as e:
        return jsonify({
            "error": "Failed to fetch quiz",
            "details": str(e)
        }), 500