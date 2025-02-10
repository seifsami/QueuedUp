from flask import Blueprint, jsonify
from bson import ObjectId
from app import mongo, redis_client  # ✅ Ensure Redis is imported

hype_blueprint = Blueprint('hype_blueprint', __name__)

@hype_blueprint.route('/update_hype_scores', methods=['POST'])
def update_hype_scores():
    """Calculates and stores raw hype scores (0 to 1) for tracked items in MongoDB."""
    db = mongo.cx["QueuedUpDBnew"]
    watchlist_collection = db["userwatchlist"]

    # ✅ Step 1: Get all items in watchlists
    pipeline = [
        {"$group": {"_id": {"item_id": "$item_id", "media_type": "$media_type"}, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    watchlist_counts = list(watchlist_collection.aggregate(pipeline))

    if not watchlist_counts:
        print("⚠️ No items found in watchlists.")
        return jsonify({"message": "No items in watchlists"}), 200

    # ✅ Step 2: Get the most hyped count (highest watchlist count for normalization)
    most_hyped_count = watchlist_counts[0]["count"]

    # ✅ Step 3: Update hype scores for each item in the respective media collection
    for entry in watchlist_counts:
        item_id = entry["_id"]["item_id"]
        media_type = entry["_id"]["media_type"]
        watchlist_count = entry["count"]

        # ✅ Compute raw hype score (0 to 1)
        raw_hype_score = watchlist_count / most_hyped_count

        # ✅ Store `hype_score` in the respective media collection
        collection = db[media_type]
        result = collection.update_one({"_id": ObjectId(item_id)}, {"$set": {"hype_score": raw_hype_score}})

        if result.matched_count > 0:
            print(f"✅ Updated hype_score for {media_type} {item_id}: {raw_hype_score}")

        # ✅ Cache raw hype sco
