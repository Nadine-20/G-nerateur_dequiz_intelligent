import cloudinary
import cloudinary.uploader
import os
from flask import request, jsonify
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    image_file = request.files['image']
    
    if image_file.filename == '':
        return jsonify({"error": "No image selected"}), 400

    upload_result = cloudinary.uploader.upload(image_file)

    image_data = {
        "url": upload_result['secure_url'],
        "public_id": upload_result['public_id'],
        "original_filename": upload_result['original_filename']
    }
    return jsonify({"message": "Image uploaded", "data": image_data}), 201
