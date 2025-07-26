from flask import Blueprint, jsonify,Flask
from bson import ObjectId
from datetime import datetime,timedelta
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

    teacher_oid = ObjectId(teacher_id)
    quizzes_collection = mongo.db["quizzes"]

    now = datetime.utcnow()
    quiz_data = {}

    # Initialize the last 12 months
    for i in range(11, -1, -1):
        month_key = (now - timedelta(days=30 * i)).strftime('%Y-%m')
        quiz_data[month_key] = []

    # Fetch relevant quizzes
    quizzes_cursor = quizzes_collection.find(
        {"createdBy": teacher_oid},
        {"createdAt": 1, "attempts": 1}
    )

    for quiz in quizzes_cursor:
        created_at = quiz.get("createdAt")
        if not created_at:
            continue

        # Ensure datetime is parsed correctly
        if isinstance(created_at, str):
            try:
                created_at = parser.parse(created_at)
            except Exception:
                continue

        month_label = created_at.strftime('%Y-%m')

        if month_label not in quiz_data:
            continue

        attempts = quiz.get("attempts", [])
        scores = [a.get("percentage", 0) for a in attempts if "percentage" in a]

        if scores:
            average = round(sum(scores) / len(scores), 2)
            quiz_data[month_label].append(average)

    # Build final result
    result = {
        "labels": [],
        "data": []
    }

    for month in sorted(quiz_data.keys()):
        monthly_scores = quiz_data[month]
        avg_score = round(sum(monthly_scores) / len(monthly_scores), 2) if monthly_scores else 0
        result["labels"].append(month)
        result["data"].append(avg_score)

    # ✅ Transform to expected frontend format
    monthly_performance = [
        {"_id": month, "count": avg}
        for month, avg in zip(result["labels"], result["data"])
    ]

    return jsonify({"monthly_performance": monthly_performance})




@dashboard_teacher_bp.route('/last_passed_students/<teacher_id>', methods=['GET'])
def get_last_passed_students(teacher_id):
    if not ObjectId.is_valid(teacher_id):
        return jsonify({"error": "Invalid teacher ID"}), 400

    teacher_oid = ObjectId(teacher_id)
    passed_attempts = []

    # Fetch quizzes created by this teacher
    teacher_quizzes = quizzes.find(
        {"createdBy": teacher_oid},
        {"attempts": 1, "subject": 1, "maxScore": 1}
    )

    for quiz in teacher_quizzes:
        max_score = quiz.get("maxScore", 100)
        passing_score = max_score * 0.5
        subject = quiz.get("subject", "Inconnu")

        for attempt in quiz.get("attempts", []):
            percentage = attempt.get("percentage", 0)
            user_id = attempt.get("student_id") or attempt.get("userId")
            submitted_at = attempt.get("date") or attempt.get("submittedAt")

            if not user_id:
                continue

                # Convert user_id to ObjectId safely
            try:
                user_oid = ObjectId(user_id) if not isinstance(user_id, ObjectId) else user_id
            except Exception:
                continue

            passed_attempts.append({
                    "user_id": user_oid,
                    "subject": subject,
                    "score": percentage,
                    "submitted_at": submitted_at
                })
                

    # Sort attempts by submitted_at descending (latest first)
    def parse_date(date_str):
        if not date_str:
            return datetime.min
        try:
            if isinstance(date_str, str):
                from dateutil import parser
                return parser.parse(date_str)
            return date_str  # assume datetime
        except Exception:
            return datetime.min

    passed_attempts.sort(key=lambda x: parse_date(x["submitted_at"]), reverse=True)

    seen_users = set()
    results = []

    for attempt in passed_attempts:
        uid = attempt["user_id"]
        if uid in seen_users:
            continue  # skip duplicates, only latest attempt per user
        seen_users.add(uid)

        user = users.find_one({"_id": uid}, {"firstName": 1, "lastName": 1})
        if not user:
            continue

        full_name = f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or "Inconnu"

        # Format date nicely for frontend display
        submitted_at = attempt["submitted_at"]
        last_activity = "N/A"
        if submitted_at:
            try:
                dt = parse_date(submitted_at)
                last_activity = dt.strftime("%d %B %Y")  # e.g. 23 avril 2025
            except Exception:
                last_activity = str(submitted_at)

        results.append({
            "name": full_name,
            "subject": attempt["subject"],
            "score": f"{attempt['score']}%",
            "lastActivity": last_activity
        })

        if len(results) >= 5:
            break

    return jsonify(results)



@dashboard_teacher_bp.route('/top_and_low_students/<teacher_id>', methods=['GET'])
def get_top_and_low_students(teacher_id):
    if not ObjectId.is_valid(teacher_id):
        return jsonify({"error": "Invalid teacher ID"}), 400

    student_scores = {}

    for quiz in quizzes.find({"createdBy": ObjectId(teacher_id)}):
        for attempt in quiz.get("attempts", []):
            student_id = attempt.get("userId") or attempt.get("student_id")
            score = attempt.get("percentage", 0)
            if not student_id:
                continue
            if student_id not in student_scores:
                student_scores[student_id] = []
            student_scores[student_id].append(score)

    performance_list = []

    for student_id, scores in student_scores.items():
        try:
            student_oid = ObjectId(student_id) if not isinstance(student_id, ObjectId) else student_id
        except:
            continue

        student = users.find_one({"_id": student_oid})
        if not student:
            continue

        name = f"{student.get('firstName', '')} {student.get('lastName', '')}".strip()
        avg_score = round(sum(scores) / len(scores), 2)
        performance_list.append({"name": name or "Inconnu", "score": avg_score})

    performance_list.sort(key=lambda x: x["score"], reverse=True)
    return jsonify({
        "top_5": performance_list[:5],
        "low_5": performance_list[-5:][::-1]
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
    quiz_list = []

    # Fetch quizzes created by the teacher
    quizzes_cursor = quizzes.find({"createdBy": teacher_oid})

    for quiz in quizzes_cursor:
        quiz_id = str(quiz["_id"])
        title = quiz.get("title", "Untitled")
        subject = quiz.get("subject", "Unknown")

        scores = []

        # Get attempts either from quiz["attempts"] or from quiz_attempts collection
        attempts = quiz.get("attempts", [])
        
        # Optional: if using a separate quiz_attempts collection:
        # attempts = quiz_attempts.find({"quiz_id": quiz["_id"]})  # Uncomment if you use this

        for attempt in attempts:
            student_id = attempt.get("student_id") or attempt.get("userId")
            percentage = attempt.get("percentage")

            if student_id is None or percentage is None:
                continue

            # Convert student_id to ObjectId
            try:
                student_oid = ObjectId(student_id) if not isinstance(student_id, ObjectId) else student_id
            except Exception:
                continue

            student = users.find_one({"_id": student_oid}, {"name": 1, "firstName": 1, "lastName": 1})

            if not student:
                student_name = "Inconnu"
            else:
                student_name = student.get("name") or f"{student.get('firstName', '')} {student.get('lastName', '')}".strip() or "Inconnu"

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
