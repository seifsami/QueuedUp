from flask import Blueprint, jsonify
from app import mongo
from datetime import datetime
from bson import ObjectId

homepage_blueprint = Blueprint('homepage_blueprint', __name__)

def get_items_from_ids(db, media_type, item_ids):
    collection = db[media_type]
    detailed_items = []
    for item_id in item_ids:
        item = collection.find_one({"_id": ObjectId(item_id)})
        if item:
            # Convert ObjectId to string
            item["_id"] = str(item["_id"])
            detailed_items.append(item)
    return detailed_items


@homepage_blueprint.route('/trending/<media_type>', methods=['GET'])
def get_trending(media_type):
    db = mongo.cx["QueuedUpDBnew"]
    today = str(datetime.now().date())

    print(f"🟢 Fetching trending {media_type} for {today}...")
    
    collection_name = f"daily_trending_{media_type}"
    print(f"🟢 Looking in collection: {collection_name}")

    trending_data = db[collection_name].find_one({"date": today})
    
    if not trending_data:
        print(f"🔴 No trending data found for {media_type}!")
        return jsonify({"error": "No trending items found"}), 404

    trending_items = trending_data.get("items", [])
    print(f"🟢 Trending items found: {trending_items}")

    detailed_items = get_items_from_ids(db, media_type, trending_items)
    
    if not detailed_items:
        print(f"🔴 No detailed items found for {media_type}!")
        return jsonify({"error": "No detailed items found"}), 404

    return jsonify(detailed_items), 200


@homepage_blueprint.route('/upcoming/<media_type>', methods=['GET'])
def get_upcoming(media_type):
    db = mongo.cx["QueuedUpDBnew"]
    today = str(datetime.now().date())
    upcoming_data = db[f"daily_upcoming_{media_type}"].find_one({"date": today})
    if upcoming_data:
        upcoming_items = upcoming_data.get("items", [])
        detailed_items = get_items_from_ids(db, media_type, upcoming_items)
        return jsonify(detailed_items), 200
    else:
        return jsonify({"error": "No upcoming items found"}), 404
