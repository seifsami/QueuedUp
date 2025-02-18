from datetime import datetime, timedelta, timezone
from bson import ObjectId
import random

def compute_leaderboard(mongo, media_type, timeframe_days):
    """
    Compute leaderboard for a specific media type and timeframe.
    Returns top 100 items sorted by watchlist additions.
    """
    db = mongo.cx["QueuedUpDBnew"]
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=timeframe_days)
    
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
    
    # If we have fewer than 100 items, fill with upcoming releases
    if len(ranked_items) < 100:
        print(f"Found {len(ranked_items)} items, filling remaining slots with upcoming releases")
        existing_ids = [item["_id"] for item in ranked_items]
        
        # Get upcoming releases not already in the list
        additional_items = list(db[media_type].aggregate([
            {
                "$match": {
                    "release_date": {"$gte": datetime.now(timezone.utc)},
                    "_id": {"$nin": existing_ids}
                }
            },
            {"$sample": {"size": 100 - len(ranked_items)}}
        ]))
        
        # Add them to ranked items with 0 watchlist count
        for item in additional_items:
            ranked_items.append({
                "_id": item["_id"],
                "watchlist_count": 0
            })
    
    # Add rank to each item
    for index, item in enumerate(ranked_items, 1):
        item["rank"] = index
    
    return ranked_items

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