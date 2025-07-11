from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
from dotenv import load_dotenv

from controllers.apprenantController import apprenant_bp, init_apprenant_controller
from controllers.upload_controller import upload_image  
from controllers.editProfile_controller import edit_profile, init_edit_profile_controller
from controllers.quizController import quiz_bp
from controllers.login_controller import login, init_login_controller
from controllers.signup_controller import signup, init_signup_controller


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


# Enregistre blueprint pour apprenant dashboard API
app.register_blueprint(apprenant_bp, url_prefix='/api/apprenant')
app.register_blueprint(quiz_bp)

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

if __name__ == "__main__":
    app.run(debug=True)
