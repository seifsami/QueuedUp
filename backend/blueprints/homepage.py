from flask import Blueprint, jsonify
from app import mongo
from datetime import datetime
from bson import ObjectId

homepage_blueprint = Blueprint('homepage_blueprint', __name__)

def get_items_from_ids(db, media_type, item_ids):
    """ Fetch multiple items in a single query instead of looping through them. """
    collection = db[media_type]

    # ✅ Optimize by using $in to fetch all items at once
    object_ids = [ObjectId(item_id) for item_id in item_ids]
    items_cursor = collection.find({"_id": {"$in": object_ids}}, {
        "_id": 1, "title": 1, "image": 1, "release_date": 1, "slug": 1, "description": 1
    })

    # Convert ObjectId to string before returning
    detailed_items = [{**item, "_id": str(item["_id"])} for item in items_cursor]
    return detailed_items

def fetch_latest_data(db, collection_name):
    """ Fetch today's data; if missing, get the most recent entry. """
    today = str(datetime.now().date())

    # ✅ Use indexed query to fetch today’s data quickly
    latest_data = db[collection_name].find_one({"date": today})

    if not latest_data:
        print(f"No data found for today ({today}). Fetching the most recent data...")

        # ✅ Optimize sorting by ensuring "date" is indexed
        latest_data = db[collection_name].find_one(
            {"date": {"$lt": today}},
            sort=[("date", -1)]  # Sort in descending order to get the most recent entry
        )

    return latest_data


@homepage_blueprint.route('/trending/<media_type>', methods=['GET'])
def get_trending(media_type):
    db = mongo.cx["QueuedUpDBnew"]
    trending_data = fetch_latest_data(db, f"daily_trending_{media_type}")

    if trending_data:
        item_ids = trending_data.get("items", [])
        detailed_items = get_items_from_ids(db, media_type, item_ids)
        return jsonify(detailed_items), 200
    else:
        return jsonify({"error": "No trending items found"}), 404


@homepage_blueprint.route('/upcoming/<media_type>', methods=['GET'])
def get_upcoming(media_type):
    db = mongo.cx["QueuedUpDBnew"]
    upcoming_data = fetch_latest_data(db, f"daily_upcoming_{media_type}")

    if upcoming_data:
        item_ids = upcoming_data.get("items", [])
        detailed_items = get_items_from_ids(db, media_type, item_ids)
        return jsonify(detailed_items), 200
    else:
        return jsonify({"error": "No upcoming items found"}), 404
