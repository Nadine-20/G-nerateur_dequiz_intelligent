from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from models.quiz import validate_quiz

quiz_bp = Blueprint('quiz_bp', __name__)

# Connexion à MongoDB
client = MongoClient("mongodb+srv://youssefbenothmen285:cQQO0P0Hr6mOo2Ej@cluster0.8dkqhcy.mongodb.net/")
db = client["platforme_quiz"]
quiz_collection = db["quizzes"]

# Convertir _id en string pour le frontend
def serialize_quiz(quiz):
    quiz["_id"] = str(quiz["_id"])
    return quiz

# 🔹 GET /api/quizzes : liste tous les quiz
@quiz_bp.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    quizzes = quiz_collection.find()
    return jsonify([serialize_quiz(q) for q in quizzes])

# 🔹 POST /api/quizzes : ajoute un nouveau quiz
@quiz_bp.route('/api/quizzes', methods=['POST'])
def create_quiz():
    data = request.get_json()
    valid, message = validate_quiz(data)
    if not valid:
        return jsonify({"error": message}), 400

    result = quiz_collection.insert_one(data)
    return jsonify({"message": "Quiz ajouté", "id": str(result.inserted_id)}), 201

# 🔹 POST /api/attempts : ajoute une tentative à un quiz
@quiz_bp.route('/api/attempts', methods=['POST'])
def save_attempt_to_quiz():
    data = request.get_json()

    quiz_id = data.get("quizId")  # "quiz_001"
    if not quiz_id:
        return jsonify({"error": "quizId manquant"}), 400

    # Cherche par _id en tant que string
    quiz = quiz_collection.find_one({"_id": quiz_id})
    if not quiz:
        return jsonify({"error": f"Aucun quiz trouvé avec le quizId : {quiz_id}"}), 404

    attempt = {
        "userId": data.get("userId"),
        "score": data.get("score"),
        "totalQuestions": data.get("totalQuestions"),
        "percentage": data.get("percentage"),
        "submittedAt": data.get("submittedAt"),
        "answers": data.get("answers")
    }

    if not attempt["userId"] or not isinstance(attempt["score"], int) or not isinstance(attempt["totalQuestions"], int):
        return jsonify({"error": "Données de tentative invalides"}), 400

    result = quiz_collection.update_one(
        {"_id": quiz_id},
        {"$push": {"attempts": attempt}}
    )

    if result.matched_count == 1:
        return jsonify({"message": "Tentative enregistrée"}), 201
    else:
        return jsonify({"error": "Échec de l'enregistrement"}), 500
  
