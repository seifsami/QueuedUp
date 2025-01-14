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
    trending_data = db[f"daily_trending_{media_type}"].find_one({"date": today})
    if trending_data:
        trending_items = trending_data.get("items", [])
        detailed_items = get_items_from_ids(db, media_type, trending_items)
        return jsonify(detailed_items), 200
    else:
        return jsonify({"error": "No trending items found"}), 404

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
