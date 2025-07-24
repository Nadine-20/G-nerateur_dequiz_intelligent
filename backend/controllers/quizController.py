from flask import Blueprint, request, jsonify
from bson import ObjectId
from models.quiz import validate_quiz

quiz_bp = Blueprint('quiz_bp', __name__)

# Global mongo variable
mongo = None

def init_quiz(mongo_instance):
    global mongo
    mongo = mongo_instance

# Convert ObjectId to string
def serialize_quiz(quiz):
    quiz["_id"] = str(quiz["_id"])
    return quiz

@quiz_bp.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    quizzes = mongo.db.quizzes.find()
    return jsonify([serialize_quiz(q) for q in quizzes])

@quiz_bp.route('/api/quizzes', methods=['POST'])
def create_quiz():
    data = request.get_json()
    valid, message = validate_quiz(data)
    if not valid:
        return jsonify({"error": message}), 400

    result = mongo.db.quizzes.insert_one(data)
    return jsonify({"message": "Quiz ajouté", "id": str(result.inserted_id)}), 201

@quiz_bp.route('/api/quizzes/<quiz_id>/attempt', methods=['POST'])
def add_attempt_to_quiz(quiz_id):
    data = request.get_json()

    try:
        quiz_object_id = ObjectId(quiz_id)
        quiz_query = {"_id": quiz_object_id}
    except:
        quiz_query = {"_id": quiz_id}

    attempt = {
        "userId": data.get("userId"),
        "score": data.get("score"),
        "totalQuestions": data.get("totalQuestions"),
        "percentage": data.get("percentage"),
        "submittedAt": data.get("submittedAt"),
        "answers": data.get("answers")
    }

    if not attempt["userId"] or not isinstance(attempt["score"], int):
        return jsonify({"error": "Tentative invalide"}), 400

    result = mongo.db.quizzes.update_one(
        quiz_query,
        {"$push": {"attempts": attempt}}
    )

    if result.matched_count != 1:
        return jsonify({"error": "Quiz non trouvé"}), 404

    user_id = data["userId"]
    user_query = {"_id": user_id}
    history_update = {"$push": {
        "quizHistory": {
            "quizId": quiz_id,
            "date": data["submittedAt"],
            "score": data["percentage"]
        }
    }}

    update_result = mongo.db.users.update_one(user_query, history_update)

    if update_result.matched_count != 1 and ObjectId.is_valid(user_id):
        user_query["_id"] = ObjectId(user_id)
        update_result = mongo.db.users.update_one(user_query, history_update)

    if update_result.matched_count != 1:
        return jsonify({"warning": "Tentative enregistrée, mais utilisateur non trouvé"}), 201

    return jsonify({"message": "Tentative et historique enregistrés"}), 201
