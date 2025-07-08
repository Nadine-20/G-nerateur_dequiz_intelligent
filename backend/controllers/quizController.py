from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from models.quiz import validate_quiz

quiz_bp = Blueprint('quiz_bp', __name__)

# Connexion MongoDB
client = MongoClient("mongodb+srv://youssefbenothmen285:cQQO0P0Hr6mOo2Ej@cluster0.8dkqhcy.mongodb.net/")
db = client["platforme_quiz"]
quiz_collection = db["quizzes"]

# Transformer _id en string
def serialize_quiz(quiz):
    quiz["_id"] = str(quiz["_id"])  # Conversion de _id en chaîne
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

    quiz_id = data.get("quizId")  # doit correspondre à _id dans MongoDB
    if not quiz_id:
        return jsonify({"error": "quizId manquant"}), 400

    # Convertir quizId en ObjectId pour correspondre à MongoDB
    try:
        quiz_id = ObjectId(quiz_id)
    except Exception as e:
        return jsonify({"error": "ID de quiz invalide"}), 400

    # Vérifie si le quiz existe
    quiz = quiz_collection.find_one({"_id": quiz_id})
    if not quiz:
        return jsonify({"error": f"Aucun quiz trouvé avec l'ID : {quiz_id}"}), 404

    # Crée la tentative
    attempt = {
        "userId": data.get("userId"),
        "score": data.get("score"),
        "totalQuestions": data.get("totalQuestions"),
        "percentage": data.get("percentage"),
        "submittedAt": data.get("submittedAt"),
        "answers": data.get("answers")
    }

    # Validation des données de la tentative
    if not attempt["userId"] or not isinstance(attempt["score"], int) or not isinstance(attempt["totalQuestions"], int):
        return jsonify({"error": "Données de tentative manquantes ou invalides"}), 400

    # Ajoute la tentative à la liste des attempts du quiz
    result = quiz_collection.update_one(
        {"_id": quiz_id},
        {"$push": {"attempts": attempt}}
    )

    if result.matched_count == 1:
        print(f"✅ Tentative ajoutée au quiz {quiz_id}")
        return jsonify({"message": "Tentative enregistrée"}), 201
    else:
        print(f"❌ Échec de l'ajout de la tentative pour le quiz {quiz_id}")
        return jsonify({"error": "Échec de l'ajout de la tentative"}), 500
