from flask import Blueprint, jsonify
from bson import ObjectId

user_bp = Blueprint('user_bp', __name__)
mongo = None  # variable globale locale

def init_user_controller(mongo_instance):
    global mongo
    mongo = mongo_instance

@user_bp.route('/', methods=['GET'])
def get_users():
    users = list(mongo.db.users.find())
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users)
