from flask import Blueprint, jsonify
from bson import ObjectId
from datetime import datetime
from dateutil import parser

dashboard_teacher_bp = Blueprint('dashboard_teacher', __name__, url_prefix='/api')

mongo = None
users = None
quizzes = None

def init_dashboard_teacher(mongo_instance):
    global mongo, users, quizzes
    mongo = mongo_instance
    users = mongo.db["users"]
    quizzes = mongo.db["quizzes"]

@dashboard_teacher_bp.route('/total_students', methods=['GET']) 
def get_total_students():
    total = users.count_documents({"role": "student"})
    return jsonify({"total_students": total})


@dashboard_teacher_bp.route('/total_quiz/<teacher_id>', methods=['GET']) 
def get_total_quiz(teacher_id):
    if not ObjectId.is_valid(teacher_id):
        return jsonify({"error": "Invalid teacher ID"}), 400
    total_quiz = quizzes.count_documents({"createdBy": ObjectId(teacher_id)})
    return jsonify({"total_quiz": total_quiz})


@dashboard_teacher_bp.route('/success_rate/<teacher_id>', methods=['GET'])
def get_success_rate(teacher_id):
    if not ObjectId.is_valid(teacher_id):
        return jsonify({"error": "Invalid teacher ID"}), 400

    teacher_quizzes = quizzes.find(
        {"createdBy": ObjectId(teacher_id)},
        {"attempts": 1, "maxScore": 1}
    )

    total_attempts = 0
    total_passes = 0

    for quiz in teacher_quizzes:
        attempts = quiz.get("attempts", [])
        max_score = quiz.get("maxScore", 100)
        passing_score = max_score * 0.5

        for attempt in attempts:
            total_attempts += 1
            if attempt.get("percentage", 0) >= passing_score:
                total_passes += 1

    if total_attempts == 0:
        return jsonify({"success_rate": 0, "message": "No quiz attempts found for this teacher."})

    success_rate = (total_passes / total_attempts) * 100
    return jsonify({"success_rate": round(success_rate, 2)})


@dashboard_teacher_bp.route('/teacher_name/<teacher_id>', methods=['GET'])
def get_teacher_name(teacher_id):
    if not ObjectId.is_valid(teacher_id):
        return jsonify({"error": "Invalid teacher ID"}), 400

    teacher = users.find_one(
        {"_id": ObjectId(teacher_id), "role": "teacher"},
        {"name": 1}
    )
    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404

    return jsonify({"name": teacher["name"]})


@dashboard_teacher_bp.route('/monthly_performance/<teacher_id>', methods=['GET'])
def get_monthly_performance(teacher_id):
    if not ObjectId.is_valid(teacher_id):
        return jsonify({"error": "Invalid teacher ID"}), 400

    pipeline = [
        {"$match": {"createdBy": ObjectId(teacher_id)}},
        {"$group": {
            "_id": {"$substr": ["$createdAt", 0, 7]},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    results = list(quizzes.aggregate(pipeline))
    return jsonify({"monthly_performance": results})


@dashboard_teacher_bp.route('/last_passed_students/<teacher_id>', methods=['GET'])
def get_last_passed_students(teacher_id):
    if not ObjectId.is_valid(teacher_id):
        return jsonify({"error": "Invalid teacher ID"}), 400

    teacher_quizzes = quizzes.find(
        {"createdBy": ObjectId(teacher_id)},
        {"attempts": 1, "maxScore": 1}
    )
    passed_students = []

    for quiz in teacher_quizzes:
        max_score = quiz.get("maxScore", 100)
        passing_score = max_score * 0.5

        for attempt in quiz.get("attempts", []):
            if attempt.get("percentage", 0) >= passing_score:
                passed_students.append({
                    "student_id": str(attempt.get("student_id")),
                    "percentage": attempt.get("percentage"),
                    "date": attempt.get("date")
                })

    passed_students.sort(key=lambda x: x["date"], reverse=True)
    return jsonify({"last_passed_students": passed_students[:5]})

@dashboard_teacher_bp.route('/top_and_low_students/<teacher_id>', methods=['GET'])
def get_top_and_low_students(teacher_id):
    if not ObjectId.is_valid(teacher_id):
        return jsonify({"error": "Invalid teacher ID"}), 400

    teacher_oid = ObjectId(teacher_id)

    # Use the global quizzes collection instead of db (which is undefined)
    global quizzes, users

    teacher_quizzes = quizzes.find({"createdBy": teacher_oid})

    students_scores = {}

    for quiz in teacher_quizzes:
        for attempt in quiz.get("attempts", []):
            student_id = attempt.get("student_id")
            score = attempt.get("percentage", 0)

            if student_id is None or score is None:
                continue

            try:
                if not isinstance(student_id, ObjectId) and ObjectId.is_valid(student_id):
                    student_oid = ObjectId(student_id)
                else:
                    student_oid = student_id
            except Exception:
                continue

            if student_oid not in students_scores or students_scores[student_oid]["score"] < score:
                student_doc = users.find_one({"_id": student_oid})
                name = student_doc.get("name") if student_doc else "Inconnu"
                students_scores[student_oid] = {"name": name, "score": score}

    students_list = list(students_scores.values())

    top_5 = sorted(students_list, key=lambda x: x["score"], reverse=True)[:5]
    low_5 = sorted(students_list, key=lambda x: x["score"])[:5]

    return jsonify({
        "top_5": top_5,
        "low_5": low_5
    })

@dashboard_teacher_bp.route('/score_distribution/<teacher_id>', methods=['GET'])
def get_score_distribution(teacher_id):
    if not ObjectId.is_valid(teacher_id):
        return jsonify({"error": "Invalid teacher ID"}), 400

    teacher_oid = ObjectId(teacher_id)

    buckets = {
        "0-49": 0,
        "50-69": 0,
        "70-89": 0,
        "90-100": 0
    }

    teacher_quizzes = quizzes.find({"createdBy": teacher_oid}, {"attempts": 1})

    for quiz in teacher_quizzes:
        for attempt in quiz.get("attempts", []):
            percentage = attempt.get("percentage")
            if percentage is None:
                continue

            if 0 <= percentage < 50:
                buckets["0-49"] += 1
            elif 50 <= percentage < 70:
                buckets["50-69"] += 1
            elif 70 <= percentage < 90:
                buckets["70-89"] += 1
            elif 90 <= percentage <= 100:
                buckets["90-100"] += 1

    return jsonify(buckets)

@dashboard_teacher_bp.route('/quiz_scores/<teacher_id>', methods=['GET'])
def get_quiz_scores(teacher_id):
    if not ObjectId.is_valid(teacher_id):
        return jsonify({"error": "Invalid teacher ID"}), 400

    teacher_oid = ObjectId(teacher_id)

    quizzes_cursor = quizzes.find({"createdBy": teacher_oid})

    quiz_list = []

    for quiz in quizzes_cursor:
        quiz_id = str(quiz["_id"])
        title = quiz.get("title", "Untitled")
        subject = quiz.get("subject", "Unknown")

        scores = []
        for attempt in quiz.get("attempts", []):
            student_id = attempt.get("student_id")
            percentage = attempt.get("percentage")

            if student_id is None or percentage is None:
                continue

            if isinstance(student_id, ObjectId):
                student_oid = student_id
            elif isinstance(student_id, str) and ObjectId.is_valid(student_id):
                student_oid = ObjectId(student_id)
            else:
                continue

            student = users.find_one({"_id": student_oid}, {"name": 1})
            student_name = student["name"] if student else "Inconnu"

            scores.append({
                "userId": str(student_oid),
                "name": student_name,
                "percentage": percentage
            })

        quiz_list.append({
            "quizId": quiz_id,
            "title": title,
            "subject": subject,
            "scores": scores
        })

    return jsonify(quiz_list)

