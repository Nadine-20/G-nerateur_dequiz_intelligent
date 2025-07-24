from flask import Flask,jsonify
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime, timedelta
from dateutil import parser

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb+srv://youssefbenothmen285:cQQO0P0Hr6mOo2Ej@cluster0.8dkqhcy.mongodb.net/")
db = client["platforme_quiz"]


@app.route('/api/total_students', methods=['GET']) 
def get_total_students():
    users_collection = db["users"]
    total = users_collection.count_documents({"role": "student"})
    return jsonify({"total_students": total})

@app.route('/api/total_quiz/<teacher_id>', methods=['GET']) 
def get_total_cours(teacher_id):
    quiz_collection = db["quizzes"]
    total_quiz = quiz_collection.count_documents({"createdBy":teacher_id})
    return jsonify({"total_quiz": total_quiz})


@app.route('/api/success_rate/<teacher_id>', methods=['GET'])
def get_success_rate(teacher_id):
    quizzes_collection = db["quizzes"]

    # Get all quizzes created by this teacher
    quizzes = list(quizzes_collection.find(
        {"createdBy": teacher_id},
        {"attempts": 1, "maxScore": 1}
    ))

    if not quizzes:
        return jsonify({"success_rate": 0, "message": "No quizzes found for this teacher."})

    total_attempts = 0
    total_passes = 0

    for quiz in quizzes:
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


@app.route('/api/monthly_performance/<teacher_id>', methods=['GET'])
def get_monthly_quiz_performance(teacher_id):
    quizzes_collection = db["quizzes"]

    now = datetime.now()
    quiz_data = {}

    for i in range(11, -1, -1):
        month = (now - timedelta(days=30 * i)).strftime('%Y-%m')
        quiz_data[month] = []

    quizzes = quizzes_collection.find(
        {"createdBy": teacher_id},
        {"createdAt": 1, "attempts": 1}
    )

    for quiz in quizzes:
        raw_date = quiz.get("createdAt")
        try:
            created_date = parser.parse(raw_date) if isinstance(raw_date, str) else raw_date
            month_label = created_date.strftime('%Y-%m')
        except Exception:
            continue

        if month_label not in quiz_data:
            continue 

        attempts = quiz.get("attempts", [])
        percentages = [a.get("percentage", 0) for a in attempts if "percentage" in a]
        if not percentages:
            continue 

        average = round(sum(percentages) / len(percentages), 2)

        quiz_data[month_label].append(average)

    result = {
        "labels": [],
        "data": []
    }

    for month in sorted(quiz_data.keys()):
        monthly_quiz_averages = quiz_data[month]
        month_avg = round(sum(monthly_quiz_averages) / len(monthly_quiz_averages), 2) if monthly_quiz_averages else 0
        result["labels"].append(month)
        result["data"].append(month_avg)

    return jsonify(result)

@app.route('/api/top_and_low_students/<teacher_id>', methods=['GET'])
def get_top_and_low_students(teacher_id):
    quizzes_collection = db["quizzes"]
    students_collection = db["users"]  # Assuming students are stored in 'users' collection

    # Fetch all quizzes created by the teacher
    quizzes = quizzes_collection.find({"createdBy": teacher_id})

    # Dictionary to store the performance of each student
    student_scores = {}

    for quiz in quizzes:
        attempts = quiz.get("attempts", [])
        for attempt in attempts:
            student_id = attempt.get("userId")
            score = attempt.get("percentage", 0)
            # Collecting all quiz attempts by student
            if student_id not in student_scores:
                student_scores[student_id] = []
            student_scores[student_id].append(score)

    # Prepare a list of students with their average scores
    student_performance = []

    for student_id, scores in student_scores.items():
        student = students_collection.find_one({"_id": student_id})
        if not student:
            continue  # Skip if the student is not found in the database
        name = f"{student.get('firstName', '')} {student.get('lastName', '')}".strip()
        average_score = round(sum(scores) / len(scores), 2)
        student_performance.append({
            "name": name,
            "score": average_score
        })

    # Sort the list by score (descending) to get top and low students
    student_performance.sort(key=lambda x: x['score'], reverse=True)

    # Get top 5 and bottom 5 students
    top_5 = student_performance[:5]
    low_5 = student_performance[-5:][::-1]  # Reverse for bottom 5 sorted from low to high

    # Return the data
    result = {
        "top_5": top_5,
        "low_5": low_5
    }

    return jsonify(result)

@app.route('/api/score_distribution/<teacher_id>', methods=['GET'])
def scoreDistribution(teacher_id):
    quizzes_collection = db["quizzes"]
    quizzes = quizzes_collection.find({"createdBy": teacher_id})
    scoreBuckets = {"0-49":0,"50-69":0,"70-89":0,"90-100":0}
    for quiz in quizzes:
        attempts = quiz.get("attempts", [])
        for attempt in attempts:
            score = attempt.get("percentage", 0)
            if score <50:
                scoreBuckets["0-49"]+=1
            elif score <70:
                scoreBuckets["50-69"]+=1
            elif score < 90:
                scoreBuckets["70-89"]+=1
            else:
                scoreBuckets["90-100"]+=1

    return jsonify(scoreBuckets)

@app.route('/api/quiz_scores/<teacher_id>', methods=['GET'])
def get_quiz_scores(teacher_id):
    quizzes = list(db["quizzes"].find({"createdBy": teacher_id}))
    users = {user["_id"]: user for user in db["users"].find({"role": "student"})}

    result = []

    for quiz in quizzes:
        quiz_info = {
            "quizId": str(quiz["_id"]),
            "title": quiz["title"],
            "subject": quiz.get("subject", "Inconnu"),
            "scores": []
        }

        for attempt in quiz.get("attempts", []):
            user_id = attempt.get("userId")
            percentage = attempt.get("percentage")

            if user_id and percentage is not None and user_id in users:
                student = users[user_id]
                full_name = f"{student.get('firstName', '')} {student.get('lastName', '')}"
                quiz_info["scores"].append({
                    "userId": user_id,
                    "name": full_name,
                    "percentage": percentage
                })

        result.append(quiz_info)

    return jsonify(result)

@app.route('/api/last_passed_students/<teacher_id>', methods=['GET'])
def get_last_passed_students(teacher_id):
    quizzes_collection = db["quizzes"]
    users_collection = db["users"]

    # Get all quizzes by this teacher
    quizzes = list(quizzes_collection.find({"createdBy": teacher_id}))

    attempts_data = []

    # Collect all passing attempts
    for quiz in quizzes:
        subject = quiz.get("subject", "Inconnu")
        max_score = quiz.get("maxScore", 100)
        passing_score = max_score * 0.5

        for attempt in quiz.get("attempts", []):
            score = attempt.get("percentage", 0)
            if score >= passing_score:
                attempts_data.append({
                    "userId": attempt.get("userId"),
                    "subject": subject,
                    "score": score,
                    "submittedAt": attempt.get("submittedAt")
                })

    # Sort attempts by submittedAt descending (latest first)
    attempts_data.sort(key=lambda x: x.get("submittedAt", ""), reverse=True)

    # To avoid duplicate students showing multiple attempts, keep track of included userIds
    seen_users = set()
    results = []

    for attempt in attempts_data:
        user_id = attempt["userId"]
        if user_id in seen_users:
            continue  # skip duplicates, only latest attempt per user
        seen_users.add(user_id)

        # Fetch user info
        user = users_collection.find_one({"_id": user_id})
        if not user:
            continue  # skip if user not found

        full_name = f"{user.get('firstName', '')} {user.get('lastName', '')}".strip()
        # Format date nicely, e.g., "23 avril 2025"
        try:
            submitted_date = datetime.strptime(attempt["submittedAt"], "%Y-%m-%dT%H:%M:%SZ")
            last_activity = submitted_date.strftime("%d %B %Y")  # day, full month name, and year
        except Exception:
            last_activity = attempt["submittedAt"]

        results.append({
            "name": full_name,
            "subject": attempt["subject"],
            "score": f"{attempt['score']}%",
            "lastActivity": last_activity
        })
        if len(results) >= 5:
            break

    return jsonify(results)   

@app.route('/api/teacher_name/<teacher_id>', methods=["GET"])
def teacher_name(teacher_id):
    user_data = db["users"].find_one({"_id": teacher_id})
    if not user_data:
        return jsonify({"error": "Teacher not found"}), 404
    fullname = f"{user_data.get('firstName', '')} {user_data.get('lastName', '')}".strip()
    return jsonify({"fullname": fullname})


if __name__ == '__main__':
    app.run(debug=True,port=5000)

