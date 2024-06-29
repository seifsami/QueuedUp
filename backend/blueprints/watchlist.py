from datetime import datetime
from flask import Blueprint, jsonify, request
from bson import ObjectId
from app import mongo

user_watchlist_blueprint = Blueprint('user_watchlist_blueprint', __name__)

@user_watchlist_blueprint.route('/<user_id>', methods=['GET'])
def get_user_watchlist(user_id):
    db = mongo.cx["QueuedUpDBnew"]
    user_watchlist = db.userwatchlist.find({"user_id": user_id})
    detailed_watchlist = []

    for item in user_watchlist:
        collection = db[item['media_type']]
        media_details = collection.find_one({"_id": ObjectId(item['item_id'])}) 
        
        # Tailor the details based on media type
        if item['media_type'] == 'books':
            # Extract book-specific details
            detailed_item = {
                "title": media_details.get("title"),
                "author": media_details.get("author"),
                "image": media_details.get("image"),
                "release_date": media_details.get("release_date")
            }
        elif item['media_type'] == 'movies':
            # Extract movie-specific details
            detailed_item = {
                "title": media_details.get("title"),
                "director": media_details.get("director"),
                "image": media_details.get("image"),
                "release_date": media_details.get("release_date")
            }
        elif item['media_type'] == 'tv_seasons':
            # Extract TV season-specific details
            detailed_item = {
                "title": media_details.get("title"),
                "network_name": media_details.get("network_name"),
                "image": media_details.get("image"),
                "release_date": media_details.get("release_date")
            }

        detailed_watchlist.append(detailed_item)

    return jsonify(detailed_watchlist), 200

@user_watchlist_blueprint.route('/<user_id>', methods=['POST'])
def add_to_watchlist(user_id):
    db = mongo.cx["QueuedUpDBnew"]
    watchlist = db.userwatchlist
    data = request.json

    new_watchlist_item = {
        "user_id": user_id,
        "item_id": data['item_id'],
        "media_type": data['media_type'],
        "timestamp_added": datetime.now()
    }

    try:
        watchlist.insert_one(new_watchlist_item)
        return jsonify({"message": "Item added to watchlist"}), 201
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@user_watchlist_blueprint.route('/<user_id>', methods=['DELETE'])
def remove_from_watchlist(user_id):
    db = mongo.cx["QueuedUpDBnew"]
    watchlist = db.userwatchlist
    data = request.json

    try:
        result = watchlist.delete_one({"user_id": user_id, "item_id": data['item_id']})

        if result.deleted_count:
            return jsonify({"message": "Item removed from watchlist"}), 200
        else:
            return jsonify({"error": "Item not found in watchlist"}), 404
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
