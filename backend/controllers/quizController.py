from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from models.quiz import validate_quiz

quiz_bp = Blueprint('quiz_bp', __name__)

# Connexion à MongoDB
client = MongoClient("mongodb+srv://youssefbenothmen285:cQQO0P0Hr6mOo2Ej@cluster0.8dkqhcy.mongodb.net/")
db = client["platforme_quiz"]
quiz_collection = db["quizzes"]
user_collection = db["users"]

# 🔹 Convertir ObjectId en string (si utilisé ailleurs)
def serialize_quiz(quiz):
    quiz["_id"] = str(quiz["_id"])
    return quiz

# 🔹 GET /api/quizzes : Récupérer tous les quiz
@quiz_bp.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    quizzes = quiz_collection.find()
    return jsonify([serialize_quiz(q) for q in quizzes])

# 🔹 POST /api/quizzes : Ajouter un nouveau quiz
@quiz_bp.route('/api/quizzes', methods=['POST'])
def create_quiz():
    data = request.get_json()
    valid, message = validate_quiz(data)
    if not valid:
        return jsonify({"error": message}), 400

    result = quiz_collection.insert_one(data)
    return jsonify({"message": "Quiz ajouté", "id": str(result.inserted_id)}), 201

@quiz_bp.route('/api/quizzes/<quiz_id>/attempt', methods=['POST'])
def add_attempt_to_quiz(quiz_id):
    data = request.get_json()

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

    # 🔹 Étape 1 : Ajouter la tentative au quiz
    result = quiz_collection.update_one(
        {"_id": quiz_id},
        {"$push": {"attempts": attempt}}
    )

    if result.matched_count != 1:
        return jsonify({"error": "Quiz non trouvé"}), 404

    # 🔹 Étape 2 : Ajouter quizId + score dans quizHistory de l'étudiant
    user_update_result = user_collection.update_one(
        {"_id": data["userId"]},
        {
            "$push": {
                "quizHistory": {
                    "quizId": quiz_id,
                    "date": { "$date": data["submittedAt"] },
                    "score": data["percentage"]
                }
            }
        }
    )

    if user_update_result.matched_count != 1:
        return jsonify({"warning": "Tentative enregistrée, mais utilisateur non trouvé"}), 201

    return jsonify({"message": "Tentative et historique enregistrés"}), 201