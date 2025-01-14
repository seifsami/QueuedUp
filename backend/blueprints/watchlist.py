from datetime import datetime
from flask import Blueprint, jsonify, request
from bson import ObjectId
from app import mongo

user_watchlist_blueprint = Blueprint('user_watchlist_blueprint', __name__)

@user_watchlist_blueprint.route('/<user_id>', methods=['GET'])
def get_user_watchlist(user_id):
    db = mongo.cx["QueuedUpDBnew"]
    user_watchlist = list(db.userwatchlist.find({"user_id": user_id}))  # Convert cursor to list
    detailed_watchlist = []

    print(f"Full watchlist for {user_id}: {user_watchlist}")

    for item in user_watchlist:
        collection = db[item['media_type']]
        media_details = collection.find_one({"_id": ObjectId(item['item_id'])})
        
        if not media_details:
            print(f"Warning: Missing media details for {item['item_id']} in {item['media_type']} collection.")
            continue

        detailed_item = {
            "title": media_details.get("title", "Unknown Title"),
            "image": media_details.get("image", ""),
            "release_date": media_details.get("release_date", "Unknown Date"),
            "media_type": item["media_type"]
        }

        if item['media_type'] == 'books':
            detailed_item["author"] = media_details.get("author", "Unknown Author")
        elif item['media_type'] == 'movies':
            detailed_item["director"] = media_details.get("director", "Unknown Director")
        elif item['media_type'] == 'tv_seasons':
            detailed_item["network_name"] = media_details.get("network_name", "Unknown Network")

        detailed_watchlist.append(detailed_item)

    print(f"Total detailed items in watchlist for user {user_id}: {len(detailed_watchlist)}")
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
