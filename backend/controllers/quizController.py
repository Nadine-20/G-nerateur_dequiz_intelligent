from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

quiz_bp = Blueprint('quiz_bp', __name__)

mongo = None

def init_quiz(mongo_instance):
    global mongo
    mongo = mongo_instance

def serialize_quiz(quiz):
    quiz["_id"] = str(quiz["_id"])
    if 'createdBy' in quiz and isinstance(quiz['createdBy'], ObjectId):
        quiz['createdBy'] = str(quiz['createdBy'])
    if 'createdAt' in quiz and isinstance(quiz['createdAt'], datetime):
        quiz['createdAt'] = quiz['createdAt'].isoformat()
    return quiz

@quiz_bp.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    try:
        quizzes = list(mongo.db.quizzes.find({}))
        
        # Ensure questions have proper structure
        for quiz in quizzes:
            if 'questions' in quiz:
                for question in quiz['questions']:
                    if 'questionText' not in question:
                        question['questionText'] = question.get('text', question.get('question', 'Question text'))
                    if 'options' in question:
                        for opt in question['options']:
                            if isinstance(opt, str):
                                opt = {'text': opt}  # Convert string options to objects
                    
            elif 'chapters' in quiz:
                quiz['questions'] = []
                for chapter in quiz['chapters']:
                    if 'quiz' in chapter:
                        quiz['questions'].append({
                            'questionText': chapter['quiz'].get('question', 'Question text'),
                            'options': chapter['quiz'].get('options', []),
                            'answer': chapter['quiz'].get('answer', 0)
                        })
        
        return jsonify([serialize_quiz(q) for q in quizzes])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@quiz_bp.route('/api/quizzes/<quiz_id>/attempt', methods=['POST'])
def add_attempt_to_quiz(quiz_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ["userId", "score", "totalQuestions", "percentage", "submittedAt"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        try:
            quiz_object_id = ObjectId(quiz_id)
            quiz_query = {"_id": quiz_object_id}
        except:
            return jsonify({"error": "Invalid quiz ID format"}), 400

        attempt = {
            "userId": data["userId"],
            "score": data["score"],
            "totalQuestions": data["totalQuestions"],
            "percentage": data["percentage"],
            "submittedAt": data["submittedAt"],
            "answers": data.get("answers", {})
        }

        if not isinstance(attempt["score"], int):
            return jsonify({"error": "Score must be an integer"}), 400

        result = mongo.db.quizzes.update_one(
            quiz_query,
            {"$push": {"attempts": attempt}}
        )

        if result.matched_count != 1:
            return jsonify({"error": "Quiz not found"}), 404

        user_id = data["userId"]
        user_query = {"_id": ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id}
        
        history_entry = {
            "quizId": quiz_id,
            "date": data["submittedAt"],
            "score": data["percentage"]
        }

        update_result = mongo.db.users.update_one(
            user_query,
            {"$push": {"quizHistory": history_entry}}
        )

        if update_result.matched_count != 1:
            return jsonify({
                "warning": "Attempt recorded but user not found",
                "message": "Quiz attempt was saved but user history wasn't updated"
            }), 201

        return jsonify({"message": "Attempt and history saved successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500