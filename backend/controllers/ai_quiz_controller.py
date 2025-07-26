from flask import request, jsonify
from bson import ObjectId
from datetime import datetime
from openai import OpenAI
import json
import re  
mongo = None
quizzes = None
users = None
ai_client = None

def init_ai_quiz_controller(mongo_instance, api_key):
    global mongo, quizzes, users, ai_client
    mongo = mongo_instance
    quizzes = mongo.db.quizzes
    users = mongo.db.users
    
    ai_client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

def generate_quiz_with_ai():
    if request.method == "OPTIONS":
        return '', 204

    try:
        if ai_client is None:
            return jsonify({"error": "AI client not initialized"}), 500

        data = request.get_json()
        required_fields = ["createdBy", "subject", "topic"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400

        difficulty = data.get("difficulty", "débutant")
        is_public = data.get("isPublic", True)
        time_limit = data.get("timeLimit", 900)
        max_score = data.get("maxScore", 100)

        prompt = f"""You are a quiz generator. Create a {difficulty} difficulty quiz about {data['topic']}.
        Return ONLY valid JSON in this exact format (NO markdown, NO additional text):
        {{
            "title": "Quiz Title",
            "description": "Brief description",
            "questions": [
                {{
                    "question": "Question text",
                    "options": ["A", "B", "C", "D"],
                    "correctAnswer": "A",
                    "explanation": "Brief explanation"
                }}
            ]
        }}"""

        response = ai_client.chat.completions.create(
            model="deepseek/deepseek-chat-v3-0324:free",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )

        raw_content = response.choices[0].message.content
        print(f"Raw AI Response: {raw_content}")

        cleaned_content = re.sub(r'^```json|```$', '', raw_content, flags=re.MULTILINE).strip()
        
        try:
            quiz_data = json.loads(cleaned_content)
        except json.JSONDecodeError as e:
            return jsonify({
                "error": "Failed to parse AI response",
                "details": str(e),
                "received_content": raw_content
            }), 500

        if not all(key in quiz_data for key in ["title", "questions"]):
            return jsonify({
                "error": "Invalid quiz format from AI",
                "received_data": quiz_data
            }), 500

        quiz = {
            "title": quiz_data["title"],
            "description": quiz_data.get("description", ""),
            "createdBy": ObjectId(data["createdBy"]),
            "createdAt": datetime.utcnow(),
            "isPublic": is_public,
            "subject": data["subject"],
            "topics": [], 
            "difficulty": difficulty,
            "timeLimit": time_limit,
            "maxScore": max_score,
            "questions": quiz_data["questions"],
            "attempts": []
        }

        result = quizzes.insert_one(quiz)

        users.update_one(
            {"_id": ObjectId(data["createdBy"])},
            {"$push": {"customQuizzes": result.inserted_id}}
        )

        return jsonify({
            **quiz,
            "_id": str(result.inserted_id),
            "createdBy": str(quiz["createdBy"]),
            "createdAt": quiz["createdAt"].isoformat()
        }), 201

    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500
