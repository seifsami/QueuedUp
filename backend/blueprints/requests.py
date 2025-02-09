from flask import Blueprint, request, jsonify
from app import mongo

request_blueprint = Blueprint('request_blueprint', __name__)

@request_blueprint.route('/request', methods=['POST'])
def submit_request():
    """Handles missing content requests."""
    data = request.json

    # Validate required fields
    if not data.get('mediaType') or not data.get('title'):
        return jsonify({"error": "Media type and title are required"}), 400

    db = mongo.cx["QueuedUpDBnew"]  # Use your DB
    requests_collection = db.requests  # New requests collection

    new_request = {
        "mediaType": data['mediaType'],
        "title": data['title'],
        "extraInfo": data.get('extraInfo', ''),
        "userId": data.get('userId', None),  # Optional user ID
        "createdAt": data.get('createdAt', None),
    }

    try:
        requests_collection.insert_one(new_request)
        return jsonify({"message": "Request submitted successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
