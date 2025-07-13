from flask import Blueprint, jsonify, request
from bson import ObjectId

apprenant_bp = Blueprint('apprenant_bp', __name__)
mongo = None

def init_apprenant_controller(mongo_instance):
    global mongo
    mongo = mongo_instance

@apprenant_bp.route('/<user_id>/progress', methods=['GET'])
def get_progress(user_id):
    # Try to find user by string ID first, then by ObjectId
    user = mongo.db.users.find_one({"_id": user_id})
    if not user and ObjectId.is_valid(user_id):
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    progress = user.get("quizHistory", [])
    return jsonify({
        "user_id": user_id,
        "progress": progress
    })

@apprenant_bp.route('/<user_id>/custom-quizzes', methods=['GET'])
def get_custom_quizzes(user_id):
    # Try to find user by string ID first, then by ObjectId
    user = mongo.db.users.find_one({"_id": user_id})
    if not user and ObjectId.is_valid(user_id):
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    custom_quiz_ids = user.get("customQuizzes", [])
    quizzes = list(mongo.db.quizzes.find({"_id": {"$in": custom_quiz_ids}}))
    for quiz in quizzes:
        quiz['_id'] = str(quiz['_id'])
    return jsonify({
        "user_id": user_id,
        "custom_quizzes": quizzes
    })

@apprenant_bp.route('/<user_id>/scores', methods=['GET'])
def get_scores(user_id):
    # Try to find user by string ID first, then by ObjectId
    user = mongo.db.users.find_one({"_id": user_id})
    if not user and ObjectId.is_valid(user_id):
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    quiz_history = user.get("quizHistory", [])
    scores = [entry.get('score', 0) for entry in quiz_history]
    return jsonify({
        "user_id": user_id,
        "scores": scores
    })

# --- Nouvelle route POST pour récupérer les quizzes par liste d'IDs ---
@apprenant_bp.route('/quizzes/by-ids', methods=['POST'])
def get_quizzes_by_ids():
    data = request.get_json()
    ids = data.get("ids", [])

    # Convertir les ids en ObjectId pour requête MongoDB
    object_ids = []
    for id_str in ids:
        try:
            object_ids.append(ObjectId(id_str))
        except:
            # skip invalid ObjectId strings
            pass

    quizzes = list(mongo.db.quizzes.find({"_id": {"$in": object_ids}}))
    for quiz in quizzes:
        quiz['_id'] = str(quiz['_id'])
    return jsonify(quizzes)
