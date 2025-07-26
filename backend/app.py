from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import os  
from dotenv import load_dotenv

from controllers.apprenantController import apprenant_bp, init_apprenant_controller
from controllers.upload_controller import upload_image  
from controllers.editProfile_controller import edit_profile, init_edit_profile_controller
from controllers.quizController import quiz_bp, init_quiz
from controllers.login_controller import login, init_login_controller
from controllers.signup_controller import signup, init_signup_controller
from controllers.creationQuizController import create_quiz, init_quiz_controller
from controllers.myQuizzesController import init_my_quizzes_controller, my_quizzes_bp
from controllers.ai_quiz_controller import init_ai_quiz_controller, generate_quiz_with_ai
from controllers.dashboardEnseignant import dashboard_teacher_bp, init_dashboard_teacher
from controllers.admin_users_controller import init_user_routes
from controllers.admin_quiz_controller import init_quiz_routes


load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")

mongo = PyMongo(app)

try:
    mongo.cx.admin.command('ping')
    print("✅ MongoDB connected successfully.")
except Exception as e:
    print("❌ MongoDB connection failed:", e)

# Initialise les contrôleurs avec mongo
init_apprenant_controller(mongo)
init_edit_profile_controller(mongo)
init_login_controller(mongo)
init_signup_controller(mongo)
init_quiz_controller(mongo)
init_quiz(mongo)
init_my_quizzes_controller(mongo)
openai_api_key = os.getenv("OPENROUTER_API_KEY")
if not openai_api_key:
    raise ValueError("OPENROUTER_API_KEY environment variable is not set.")
init_ai_quiz_controller(mongo, openai_api_key)
init_dashboard_teacher(mongo)
init_user_routes(app, mongo)
init_quiz_routes(app, mongo)

# Enregistre blueprint pour apprenant dashboard API
app.register_blueprint(apprenant_bp, url_prefix='/api/apprenant')
app.register_blueprint(quiz_bp)
app.register_blueprint(my_quizzes_bp)
app.register_blueprint(dashboard_teacher_bp)

@app.route("/upload", methods=["POST"])
def handle_upload():
    return upload_image()

@app.route("/api/editProfile", methods=["PUT"])
def handle_edit_profile():
    return edit_profile()

@app.route("/api/login", methods=["POST"])
def handle_login():
    return login()

@app.route("/api/signup", methods=["POST"])
def handle_signup():
    return signup()

@app.route("/api/create-quiz", methods=["POST"])
def handle_create_quiz():
    return create_quiz()


@app.route("/quizzes/generate", methods=["POST", "OPTIONS"])
def generate_quiz():
    return generate_quiz_with_ai()
# Debug endpoint to check users
@app.route("/api/debug/users", methods=["GET"])
def debug_users():
    users = mongo.db.users.find()
    user_list = []
    for user in users:
        user_list.append({
            "_id": str(user.get("_id")),
            "email": user.get("email"),
            "firstName": user.get("firstName"),
            "lastName": user.get("lastName"),
            "role": user.get("role"),
            "hasPassword": bool(user.get("password"))
        })
    return jsonify({"users": user_list, "count": len(user_list)})

if __name__ == "__main__":
    app.run(debug=True)
