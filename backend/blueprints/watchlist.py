from datetime import datetime
from flask import Blueprint, jsonify, request
from bson import ObjectId
from app import mongo

user_watchlist_blueprint = Blueprint('user_watchlist_blueprint', __name__)

@user_watchlist_blueprint.route('/<user_id>', methods=['GET'])
def get_user_watchlist(user_id):
    db = mongo.cx["QueuedUpDBnew"]
    
    # Fetch all watchlist items in ONE query
    user_watchlist = list(db.userwatchlist.find({"user_id": user_id}, {"item_id": 1, "media_type": 1, "_id": 0}))
    
    if not user_watchlist:
        return jsonify([]), 200  # Return early if watchlist is empty

    print(f"Full watchlist for {user_id}: {user_watchlist}")

    # Group item IDs by media type to batch fetch them
    media_type_map = {}
    for item in user_watchlist:
        media_type_map.setdefault(item["media_type"], []).append(ObjectId(item["item_id"]))

    detailed_watchlist = []
    
    # Batch fetch media details for each media type
    for media_type, item_ids in media_type_map.items():
        collection = db[media_type]
        media_details_list = list(collection.find({"_id": {"$in": item_ids}}, {
            "_id": 1, "title": 1, "image": 1, "release_date": 1, "slug": 1,
            "author": 1, "director": 1, "network_name": 1, "description": 1
        }))

        # Map results by ID for quick lookup
        media_details_map = {str(media["_id"]): media for media in media_details_list}

        # Build detailed watchlist response
        for item in user_watchlist:
            if item["media_type"] != media_type:
                continue

            media_details = media_details_map.get(item["item_id"])
            if not media_details:
                print(f"Warning: Missing media details for {item['item_id']} in {media_type} collection.")
                continue

            detailed_item = {
                "item_id": str(media_details["_id"]),
                "title": media_details.get("title", "Unknown Title"),
                "image": media_details.get("image", ""),
                "release_date": media_details.get("release_date", "Unknown Date"),
                "media_type": media_type,
                "slug": media_details.get("slug", None),
                "description": media_details.get("description", "No Description Available")
            }

            if media_type == 'books':
                detailed_item["author"] = media_details.get("author", "Unknown Author")
            elif media_type == 'movies':
                detailed_item["director"] = media_details.get("director", "Unknown Director")
            elif media_type == 'tv_seasons':
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

from bson import ObjectId

@user_watchlist_blueprint.route('/<user_id>', methods=['DELETE'])
def remove_from_watchlist(user_id):
    db = mongo.cx["QueuedUpDBnew"]
    watchlist = db.userwatchlist
    data = request.json  # Get JSON payload

    # ✅ Strip any whitespace and fix potential formatting issues
    clean_user_id = user_id.strip().replace("'", "")  # Removes unwanted quotes
    item_id = data.get("item_id")

    print(f"Received DELETE request for user: {clean_user_id}")
    print(f"with payload: {data}")

    query = {"user_id": clean_user_id, "item_id": item_id}  # ✅ Clean query
    print(f"Formatted delete query: {query}")

    try:
        result = watchlist.delete_one(query)
        print(f"MongoDB delete result: {result.deleted_count}")

        if result.deleted_count:
            return jsonify({"message": "Item removed from watchlist"}), 200
        else:
            return jsonify({"error": "Item not found in watchlist"}), 404
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@media_blueprint.route('/featured/<media_type>', methods=['GET'])
def get_featured_release(media_type):
    """Fetch the manually set featured release for the current week."""
    try:
        db = mongo.cx["QueuedUpDBnew"]
        collection = db[media_type]

        slug = get_featured_slug(media_type)
        if not slug:
            return jsonify({"error": "No featured release found"}), 404

        fields_to_include = {
            "title": 1, "release_date": 1, "image": 1, "description": 1, "slug": 1
        }
        item = collection.find_one({"slug": slug}, fields_to_include)

        if item:
            item['_id'] = str(item['_id'])  # Convert ObjectId to string
            item['media_type'] = media_type  # Ensure media type is included
            return jsonify(item), 200
        else:
            return jsonify({"error": "Featured release not found"}), 404
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500