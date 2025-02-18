from flask import Blueprint, jsonify, current_app
from tasks.leaderboard import update_leaderboards
import json
from datetime import datetime
from bson import json_util

leaderboard_blueprint = Blueprint('leaderboard_blueprint', __name__)

def parse_json(data):
    """Convert MongoDB BSON to JSON-serializable format"""
    return json.loads(json_util.dumps(data))

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

@leaderboard_blueprint.route('/leaderboard/<timeframe>/<media_type>', methods=['GET'])
def get_leaderboard(timeframe, media_type):
    """
    Get leaderboard data for a specific timeframe and media type.
    Checks Redis cache first, falls back to MongoDB if needed.
    """
    if timeframe not in ['weekly', 'monthly']:
        return jsonify({"error": "Invalid timeframe. Use 'weekly' or 'monthly'"}), 400
    
    if media_type not in ['books', 'movies', 'tv_seasons']:
        return jsonify({"error": "Invalid media type"}), 400
        
    collection_name = f"leaderboard_{timeframe}_{media_type}"
    
    try:
        # Check Redis cache first
        redis_client = current_app.config.get("REDIS_CLIENT")
        if redis_client:
            cached_data = redis_client.get(collection_name)
            if cached_data:
                return jsonify({"status": "success", "data": json.loads(cached_data)}), 200
        
        # If no cache or no Redis, get from MongoDB
        mongo = current_app.extensions['pymongo']
        db = mongo.cx["QueuedUpDBnew"]
        
        leaderboard_data = db[collection_name].find_one({"_id": "leaderboard"})
        if not leaderboard_data:
            return jsonify({"error": "Leaderboard not found"}), 404
            
        # Convert MongoDB data to JSON-serializable format
        response_data = parse_json(leaderboard_data)
        
        # Cache in Redis if available
        if redis_client:
            redis_client.setex(
                collection_name,
                24 * 60 * 60,  # 24 hours
                json.dumps(response_data)
            )
        
        return jsonify({"status": "success", "data": response_data}), 200
        
    except Exception as e:
        print(f"Error retrieving leaderboard: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500