from flask import Blueprint, jsonify, current_app
from bson import ObjectId
import random

hype_blueprint = Blueprint('hype_blueprint', __name__)

@hype_blueprint.route('/update', methods=['POST'])
def update_hype_scores():
    """Daily cron job to calculate hype scores for all media types."""
    try:
        db = current_app.extensions['pymongo'].cx["QueuedUpDBnew"]
        watchlist_collection = db["userwatchlist"]
        media_types = ['books', 'movies', 'tv_seasons']

        for media_type in media_types:
            print(f"📊 Processing hype scores for {media_type}")

            # Step 1: Get watchlist counts for all items in this media type
            watchlist_counts = watchlist_collection.aggregate([
                {"$match": {"media_type": media_type}},
                {"$group": {"_id": "$item_id", "count": {"$sum": 1}}},
            ])

            watchlist_map = {str(item["_id"]): item["count"] for item in watchlist_counts}
            max_watchlist_count = max(watchlist_map.values(), default=1)  # Prevent division by zero

            print(f"🔥 Most watched {media_type} has {max_watchlist_count} watchlists")

            # Step 2: Assign hype scores
            updates = []
            for item_id, count in watchlist_map.items():
                raw_hype_score = count / max_watchlist_count  # Normalize

                # Assign hype meter percentage
                if raw_hype_score >= 0.8:
                    hype_percentage = "100%"
                elif raw_hype_score >= 0.5:
                    hype_percentage = "80%"
                elif raw_hype_score >= 0.3:
                    hype_percentage = "60%"
                elif raw_hype_score >= 0.1:
                    hype_percentage = "40%"
                else:
                    hype_percentage = "25%"  # Default for bottom 10%

                updates.append((item_id, raw_hype_score, hype_percentage))

            # Step 3: Find all items & add missing ones with 0 watchlist count
            all_items = db[media_type].find({}, {"_id": 1})  # Get all items
            for item in all_items:
                item_id = str(item["_id"])
                if item_id not in watchlist_map:  # Items with 0 watchlists
                    raw_hype_score = 0
                    hype_percentage = random.choice(["25%", "40%"])  # Randomize

                    updates.append((item_id, raw_hype_score, hype_percentage))

            # Step 4: Bulk update MongoDB
            for item_id, raw_hype, hype_percent in updates:
                db[media_type].update_one(
                    {"_id": ObjectId(item_id)},
                    {"$set": {"raw_hype_score": raw_hype, "hype_meter_percentage": hype_percent}}
                )

            print(f"✅ Updated {len(updates)} items for {media_type}")

        return jsonify({"status": "success", "message": "Hype scores updated"}), 200
    except Exception as e:
        print(f"❌ Error updating hype scores: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
