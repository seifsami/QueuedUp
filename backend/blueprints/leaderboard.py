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
    - page: page number (1-based), defaults to 1
    """
    try:
        timeframe = request.args.get('timeframe')
        media_type = request.args.get('media_type')
        page = max(1, int(request.args.get('page', 1)))  # Default to page 1, ensure it's at least 1
        
        ITEMS_PER_PAGE = 20
        skip = (page - 1) * ITEMS_PER_PAGE
        
        # Validate parameters
        if timeframe not in ['weekly', 'monthly']:
            return jsonify({"error": "Invalid timeframe. Use 'weekly' or 'monthly'"}), 400
        
        if media_type not in ['books', 'movies', 'tv_seasons']:
            return jsonify({"error": "Invalid media type"}), 400
            
        collection_name = f"leaderboard_{timeframe}_{media_type}"
        cache_key = f"api_{collection_name}_page_{page}"
        
        print(f"Fetching leaderboard for collection: {collection_name}")
        
        # Check Redis cache first
        redis_client = current_app.config.get("REDIS_CLIENT")
        if redis_client:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                print("Using cached data")
                return jsonify(json.loads(cached_data)), 200
        
        # If no cache or no Redis, get from MongoDB and enrich with item details
        mongo = current_app.extensions['pymongo']
        db = mongo.cx["QueuedUpDBnew"]
        
        print("Fetching from MongoDB...")
        # Get base leaderboard data
        leaderboard_data = db[collection_name].find_one({"_id": "leaderboard"})
        print(f"Found leaderboard data: {leaderboard_data is not None}")
        
        if not leaderboard_data:
            print("No leaderboard data found, computing...")
            # If leaderboard not found, compute it
            update_leaderboards(mongo, redis_client)
            leaderboard_data = db[collection_name].find_one({"_id": "leaderboard"})
            if not leaderboard_data:
                return jsonify({"error": "Leaderboard not found"}), 404

        print(f"Total items in leaderboard: {len(leaderboard_data.get('items', []))}")
        total_items = len(leaderboard_data["items"])
        total_pages = (total_items + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE

        if page > total_pages:
            return jsonify({"error": f"Page {page} does not exist. Max page is {total_pages}"}), 404

        # Get the paginated slice of items
        paginated_items = leaderboard_data["items"][skip:skip + ITEMS_PER_PAGE]
        print(f"Paginated items: {len(paginated_items)}")
        
        response_data = {
            "timeframe": timeframe,
            "media_type": media_type,
            "last_updated": format_datetime(leaderboard_data["last_updated"]),
            "items": paginated_items,
            "pagination": {
                "page": page,
                "total_pages": total_pages,
                "total_items": total_items,
                "items_per_page": ITEMS_PER_PAGE,
                "has_next": page < total_pages,
                "has_prev": page > 1
            }
        }
        
        # Cache enriched response in Redis
        if redis_client:
            redis_client.setex(
                cache_key,
                24 * 60 * 60,  # 24 hours
                json.dumps(response_data)
            )
        
        return jsonify(response_data), 200
        
    except Exception as e:
        import traceback
        error_details = {
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }
        print(f"Error retrieving leaderboard: {error_details}")
        return jsonify(error_details), 500