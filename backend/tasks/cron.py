from datetime import datetime, timedelta, timezone
from bson import ObjectId
import random

def get_trending_items(mongo, media_type):
    db = mongo.cx["QueuedUpDBnew"]
    one_week_ago = datetime.now() - timedelta(days=7)

    print(f"Fetching trending items for {media_type} since {one_week_ago}")

    trending_items = db.userwatchlist.aggregate([
        {"$match": {"media_type": media_type, "timestamp_added": {"$gte": one_week_ago}}},
        {"$group": {"_id": "$item_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 20}
    ])

    items = [item["_id"] for item in trending_items]

    # If less than 20 trending items found, fill the rest with random items with future release dates OR null release dates
    if len(items) < 20:
        print(f"Found {len(items)} trending items, fetching additional random items to fill up to 20.")
        additional_items = db[media_type].aggregate([
            {"$match": {
                "$or": [
                    {"release_date": {"$gte": datetime.now()}},
                    {"release_date": None}
                ], 
                "_id": {"$nin": items}
            }},
            {"$sample": {"size": 20 - len(items)}}
        ])
        items.extend([item["_id"] for item in additional_items])

    print(f"Trending items for {media_type}: {items}")
    return items

def get_upcoming_items(mongo, media_type):
    db = mongo.cx["QueuedUpDBnew"]
    today = datetime.now()
    one_month_from_now = today + timedelta(days=30)

    print(f"Fetching upcoming items for {media_type} coming out between {today} and {one_month_from_now}")

    upcoming_items = db[media_type].aggregate([
        {"$match": {"release_date": {"$gte": today, "$lt": one_month_from_now}}},
        {"$sort": {"popularity": -1}},  # Sort by popularity first
        {"$limit": 20}
    ])

    items = [item["_id"] for item in upcoming_items]

    # If less than 20 upcoming items, fill with random items with future release dates not in the upcoming list
    if len(items) < 20:
        print(f"Found {len(items)} upcoming items, fetching additional random items to fill up to 20.")
        additional_items = db[media_type].aggregate([
            {"$match": {"release_date": {"$gte": today}, "_id": {"$nin": items}}},
            {"$sample": {"size": 20 - len(items)}}
        ])
        items.extend([item["_id"] for item in additional_items])

    print(f"Upcoming items for {media_type}: {items}")
    return items

def update_trending_and_upcoming(mongo):
    db = mongo.cx["QueuedUpDBnew"]
    today = datetime.now(timezone.utc).date()

    print("Updating trending and upcoming items")
    media_types = ["books", "movies", "tv_seasons"]

    for media_type in media_types:
        try:
            print(f"Processing {media_type}")
            trending_items = get_trending_items(mongo, media_type)
            upcoming_items = get_upcoming_items(mongo, media_type)

            print(f"Updating daily_trending_{media_type} and daily_upcoming_{media_type}")

            db[f"daily_trending_{media_type}"].update_one(
                {"date": str(today)}, 
                {"$set": {"items": trending_items}}, 
                upsert=True
            )
            db[f"daily_upcoming_{media_type}"].update_one(
                {"date": str(today)}, 
                {"$set": {"items": upcoming_items}}, 
                upsert=True
            )
        except Exception as e:
            print(f"Error processing {media_type}: {e}")

    print("Trending and upcoming items updated")

if __name__ == "__main__":
    from app import create_app, mongo
    app = create_app()
    with app.app_context():
        update_trending_and_upcoming(mongo)
