from flask import request, jsonify
from bson import ObjectId
from datetime import datetime

def init_quiz_routes(app, mongo):
    @app.route('/quizzes', methods=['GET'])
    def get_all_quizzes():
        try:
            quizzes = list(mongo.db.quizzes.find())
            for quiz in quizzes:
                quiz['_id'] = str(quiz['_id'])
                quiz['createdBy'] = str(quiz['createdBy'])
            return jsonify(quizzes)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/quizzes/<quiz_id>', methods=['GET'])
    def get_quiz(quiz_id):
        try:
            if not ObjectId.is_valid(quiz_id):
                return jsonify({"error": "Invalid quiz ID"}), 400
            
            quiz = mongo.db.quizzes.find_one({"_id": ObjectId(quiz_id)})
            
            if not quiz:
                return jsonify({"error": "Quiz not found"}), 404
                
            quiz['_id'] = str(quiz['_id'])
            quiz['createdBy'] = str(quiz['createdBy'])
            return jsonify(quiz)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/quizzes/<quiz_id>', methods=['PUT'])
    def update_quiz(quiz_id):
        try:
            if not ObjectId.is_valid(quiz_id):
                return jsonify({"error": "Invalid quiz ID"}), 400
            
            data = request.get_json()
            update_data = {}
            
            updatable_fields = [
                'title', 'description', 'isPublic', 
                'subject', 'topics', 'difficulty',
                'timeLimit', 'maxScore'
            ]
            
            for field in updatable_fields:
                if field in data:
                    update_data[field] = data[field]
            
            if 'questions' in data:
                if not isinstance(data['questions'], list) or len(data['questions']) == 0:
                    return jsonify({"error": "Questions must be a non-empty array"}), 400
                update_data['questions'] = data['questions']
            
            if not update_data:
                return jsonify({"error": "No valid fields to update"}), 400
            
            result = mongo.db.quizzes.update_one(
                {"_id": ObjectId(quiz_id)},
                {"$set": update_data}
            )
            
            if result.matched_count == 0:
                return jsonify({"error": "Quiz not found"}), 404
            
            return jsonify({"message": "Quiz updated successfully"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/quizzes/<quiz_id>', methods=['DELETE'])
    def delete_quiz(quiz_id):
        try:
            if not ObjectId.is_valid(quiz_id):
                return jsonify({"error": "Invalid quiz ID"}), 400
            
            quiz = mongo.db.quizzes.find_one({"_id": ObjectId(quiz_id)})
            if not quiz:
                return jsonify({"error": "Quiz not found"}), 404
            
            mongo.db.users.update_one(
                {"_id": quiz['createdBy']},
                {"$pull": {"customQuizzes": ObjectId(quiz_id)}}
            )
            
            result = mongo.db.quizzes.delete_one({"_id": ObjectId(quiz_id)})
            
            return jsonify({"message": "Quiz deleted successfully"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500