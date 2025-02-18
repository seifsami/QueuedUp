from datetime import datetime, timedelta, timezone
from bson import ObjectId
import random
from flask import current_app

def calculate_hype_score(raw_score):
    """Calculate hype meter percentage from raw score"""
    if raw_score is None or raw_score == 0:
        return random.choice([25, 40])  # Random assignment for 0/missing values
    elif raw_score >= 0.8:
        return 100
    elif raw_score >= 0.5:
        return 80
    elif raw_score >= 0.3:
        return 60
    elif raw_score >= 0.1:
        return 40
    else:
        return 25

def compute_leaderboard(mongo, media_type, timeframe_days):
    """
    Compute leaderboard for a specific media type and timeframe.
    Returns top 100 items sorted by watchlist additions.
    """
    db = mongo.cx["QueuedUpDBnew"]
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=timeframe_days)
    current_time = datetime.now(timezone.utc)
    redis_client = current_app.config.get("REDIS_CLIENT")
    
    print(f"Computing {timeframe_days}-day leaderboard for {media_type}")
    
    # Get watchlist additions within timeframe
    ranked_items = list(db.userwatchlist.aggregate([
        {
            "$match": {
                "media_type": media_type,
                "timestamp_added": {"$gte": cutoff_date}
            }
        },
        {
            "$group": {
                "_id": "$item_id",
                "watchlist_count": {"$sum": 1}
            }
        },
        {"$sort": {"watchlist_count": -1}},
        {"$limit": 100}
    ]))
    
    # If we have fewer than 100 items, fill with other items
    if len(ranked_items) < 100:
        print(f"Found {len(ranked_items)} items, filling remaining slots with additional items")
        existing_ids = [item["_id"] for item in ranked_items]
        
        # Get additional items not already in the list
        additional_items = list(db[media_type].aggregate([
            {
                "$match": {
                    "_id": {"$nin": existing_ids},
                    "$or": [
                        {"release_date": {"$gt": current_time}},
                        {"release_date": None}
                    ]
                }
            },
            {"$sort": {"popularity": -1}},
            {"$limit": 100 - len(ranked_items)}
        ]))
        
        # Add them to ranked items with 0 watchlist count
        for item in additional_items:
            ranked_items.append({
                "_id": item["_id"],
                "watchlist_count": 0
            })
    
    # Enrich items with details and get hype percentages
    enriched_items = []
    for index, item in enumerate(ranked_items, 1):
        item_id = item["_id"]
        try:
            # Get full item details
            item_details = db[media_type].find_one({"_id": ObjectId(item_id)})
            if item_details:
                # Get creator info based on media type
                creator = None
                if media_type == "books":
                    creator = item_details.get("author")
                elif media_type == "movies":
                    creator = item_details.get("director")
                elif media_type == "tv_seasons":
                    creator = item_details.get("network_name")
                
                # Check Redis cache for hype percentage first
                hype_percentage = None
                if redis_client:
                    hype_cache_key = f"hype_meter:{media_type}:{str(item_id)}"
                    cached_hype = redis_client.get(hype_cache_key)
                    if cached_hype:
                        print(f"⚡ Using cached Hype Meter for {item_id}")
                        hype_percentage = int(cached_hype)
                
                # If not in cache, calculate it
                if hype_percentage is None:
                    raw_hype_score = item_details.get("hype_score", 0)
                    print(f"Raw hype score for {item_id}: {raw_hype_score}")
                    if raw_hype_score is None or raw_hype_score == 0:
                        hype_percentage = random.choice([25, 40])
                    elif raw_hype_score >= 0.8:
                        hype_percentage = 100
                    elif raw_hype_score >= 0.5:
                        hype_percentage = 80
                    elif raw_hype_score >= 0.3:
                        hype_percentage = 60
                    elif raw_hype_score >= 0.1:
                        hype_percentage = 40
                    else:
                        hype_percentage = 25
                    
                    # Cache the calculated percentage
                    if redis_client:
                        redis_client.setex(hype_cache_key, 86400, hype_percentage)  # 24 hour cache
                
                enriched_item = {
                    "rank": index,
                    "item_id": str(item_id),
                    "watchlist_count": item["watchlist_count"],
                    "title": item_details.get("title"),
                    "release_date": item_details.get("release_date"),
                    "image": item_details.get("image"),
                    "hype_meter_percentage": hype_percentage,
                    "slug": item_details.get("slug"),
                    "media_type": media_type,
                    "creator": creator
                }
                enriched_items.append(enriched_item)
                print(f"Enriched item {item_id} with hype percentage: {hype_percentage}")
        except Exception as e:
            print(f"Error enriching item {item_id}: {str(e)}")
            continue
    
    print(f"Final leaderboard for {media_type} has {len(enriched_items)} items")
    return enriched_items

def update_leaderboards(mongo, redis_client=None):
    """
    Update all leaderboards (weekly and monthly) for all media types.
    Stores results in MongoDB and optionally caches in Redis.
    """
    db = mongo.cx["QueuedUpDBnew"]
    media_types = ["books", "movies", "tv_seasons"]
    timeframes = [
        ("weekly", 7),
        ("monthly", 30)
    ]
    
    current_time = datetime.now(timezone.utc)
    
    for media_type in media_types:
        for timeframe_name, days in timeframes:
            collection_name = f"leaderboard_{timeframe_name}_{media_type}"
            print(f"Updating {collection_name}")
            
            try:
                # Compute rankings
                ranked_items = compute_leaderboard(mongo, media_type, days)
                
                # Update MongoDB
                db[collection_name].update_one(
                    {"_id": "leaderboard"},
                    {
                        "$set": {
                            "last_updated": current_time,
                            "items": ranked_items
                        }
                    },
                    upsert=True
                )
                
                # Update Redis cache if available
                if redis_client:
                    cache_key = collection_name
                    cache_data = {
                        "last_updated": current_time.isoformat(),
                        "items": ranked_items
                    }
                    redis_client.setex(
                        cache_key,
                        24 * 60 * 60,  # 24 hours in seconds
                        str(cache_data)  # Convert to string for Redis storage
                    )
                
                print(f"Successfully updated {collection_name}")
                
            except Exception as e:
                print(f"Error updating {collection_name}: {str(e)}")
                raise e

if __name__ == "__main__":
    from app import create_app, mongo
    app = create_app()
    with app.app_context():
        update_leaderboards(mongo) 