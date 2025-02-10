from flask import Blueprint, jsonify
from bson import ObjectId
import random
from app import mongo, redis_client  # ✅ Ensure Redis is imported

hype_blueprint = Blueprint('hype_blueprint', __name__)

@hype_blueprint.route('/hype/<media_type>/<item_id>', methods=['GET'])
def get_hype_score(media_type, item_id):
    """ Returns the cached hype score or computes it on-demand """
    db = mongo.cx["QueuedUpDBnew"]
    watchlist_collection = db["userwatchlist"]

    # Check Redis cache first
    cache_key = f"hype:{media_type}:{item_id}"
    cached_score = redis_client.get(cache_key)

    if cached_score:
        print(f"✅ Cache hit for {cache_key}")
        return jsonify({"hype_meter_percentage": int(cached_score)}), 200

    print(f"⏳ Cache miss! Computing hype score for {media_type} {item_id}")

    # Step 1: Get how many users have added this item
    watchlist_count = watchlist_collection.count_documents({"item_id": item_id, "media_type": media_type})

    # Step 2: Get the most tracked item to normalize scores
    most_hyped = watchlist_collection.aggregate([
        {"$match": {"media_type": media_type}},
        {"$group": {"_id": "$item_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ])
    most_hyped_count = next(most_hyped, {}).get("count", 1)  # Avoid divide-by-zero

    if watchlist_count == 0:
        # If no one is tracking this item, assign a randomized score (for variety)
        hype_meter_percentage = random.choice([25, 40])
    else:
        raw_hype_score = watchlist_count / most_hyped_count

        # Map score to tiers
        if raw_hype_score >= 0.8:
            hype_meter_percentage = 100
        elif raw_hype_score >= 0.5:
            hype_meter_percentage = 80
        elif raw_hype_score >= 0.3:
            hype_meter_percentage = 60
        elif raw_hype_score >= 0.1:
            hype_meter_percentage = 40
        else:
            hype_meter_percentage = 25

    # Step 3: Cache the result for 24 hours
    redis_client.setex(cache_key, 86400, hype_meter_percentage)
    print(f"✅ Cached {cache_key} for 24h: {hype_meter_percentage}%")

    return jsonify({"hype_meter_percentage": hype_meter_percentage}), 200
