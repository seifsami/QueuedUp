from flask import Blueprint, jsonify, current_app, request
from tasks.leaderboard import update_leaderboards
import json
from datetime import datetime
from bson import json_util, ObjectId

leaderboard_blueprint = Blueprint('leaderboard_blueprint', __name__)

def parse_json(data):
    """Convert MongoDB BSON to JSON-serializable format"""
    return json.loads(json_util.dumps(data))

def format_datetime(dt):
    """Format datetime object to ISO format string"""
    if isinstance(dt, datetime):
        return dt.isoformat()
    return dt

@leaderboard_blueprint.route('/update_leaderboards', methods=['POST'])
def trigger_leaderboard_update():
    """
    Manually trigger leaderboard computation and updates.
    This endpoint will be called by Heroku Scheduler daily.
    """
    print("Manually triggering leaderboard update")
    try:
        with current_app.app_context():
            mongo = current_app.extensions['pymongo']
            redis_client = current_app.config.get("REDIS_CLIENT")
            update_leaderboards(mongo, redis_client)
        return jsonify({"status": "success", "message": "Leaderboards updated successfully"}), 200
    except Exception as e:
        print(f"Error updating leaderboards: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@leaderboard_blueprint.route('/api/leaderboard', methods=['GET'])
def get_leaderboard_data():
    """
    Get leaderboard data with full item details.
    Query params:
    - timeframe: weekly or monthly
    - media_type: books, movies, or tv_seasons
    """
    timeframe = request.args.get('timeframe')
    media_type = request.args.get('media_type')

    # Validate parameters
    if timeframe not in ['weekly', 'monthly']:
        return jsonify({"error": "Invalid timeframe. Use 'weekly' or 'monthly'"}), 400
    
    if media_type not in ['books', 'movies', 'tv_seasons']:
        return jsonify({"error": "Invalid media type"}), 400
        
    collection_name = f"leaderboard_{timeframe}_{media_type}"
    
    try:
        # Check Redis cache first
        redis_client = current_app.config.get("REDIS_CLIENT")
        if redis_client:
            cached_data = redis_client.get(f"api_{collection_name}")  # Use different key for API cache
            if cached_data:
                return jsonify(json.loads(cached_data)), 200
        
        # If no cache or no Redis, get from MongoDB and enrich with item details
        mongo = current_app.extensions['pymongo']
        db = mongo.cx["QueuedUpDBnew"]
        
        # Get base leaderboard data
        leaderboard_data = db[collection_name].find_one({"_id": "leaderboard"})
        if not leaderboard_data:
            return jsonify({"error": "Leaderboard not found"}), 404

        # Get item details for all items in the leaderboard
        item_ids = [ObjectId(item["_id"]) for item in leaderboard_data["items"]]
        items_collection = db[media_type]
        items_details = {
            str(item["_id"]): item 
            for item in items_collection.find({"_id": {"$in": item_ids}})
        }

        # Combine leaderboard data with item details
        enriched_items = []
        for item in leaderboard_data["items"]:
            item_id = str(item["_id"])
            if item_id in items_details:
                details = items_details[item_id]
                enriched_items.append({
                    "rank": item["rank"],
                    "item_id": item_id,
                    "watchlist_count": item["watchlist_count"],
                    "title": details.get("title"),
                    "release_date": format_datetime(details.get("release_date")),
                    "image": details.get("image"),
                    "hype_score": details.get("hype_meter_percentage", 0),
                    "slug": details.get("slug"),
                    "media_type": media_type
                })

        response_data = {
            "timeframe": timeframe,
            "media_type": media_type,
            "last_updated": format_datetime(leaderboard_data["last_updated"]),
            "items": enriched_items
        }
        
        # Cache enriched response in Redis
        if redis_client:
            redis_client.setex(
                f"api_{collection_name}",
                24 * 60 * 60,  # 24 hours
                json.dumps(response_data)  # Now JSON-serializable because we formatted the dates
            )
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error retrieving leaderboard: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500