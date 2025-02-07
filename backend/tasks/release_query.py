from datetime import datetime
from bson import ObjectId
from app import mongo  # Ensure this correctly imports the MongoDB instance

from datetime import datetime, timedelta

def get_today_releases():
    """Fetch media items releasing today from MongoDB"""
    db = mongo.cx["QueuedUpDBnew"]
    
    # Get the current UTC date at midnight
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow_start = today_start + timedelta(days=1)

    collections = ['books', 'movies', 'tv_seasons']  # Books first
    today_releases = {"books": [], "movies": [], "tv_seasons": []}

    for collection_name in collections:
        collection = db[collection_name]

        # Query for items where release_date is within today
        items = list(collection.find({
            "release_date": {
                "$gte": today_start,  # Greater than or equal to midnight today
                "$lt": tomorrow_start  # Less than midnight tomorrow
            }
        }, {
            "_id": 1,
            "title": 1,
            "release_date": 1,
            "image": 1,  # Ensure images are included
        }))

        for item in items:
            today_releases[collection_name].append({
                "_id": str(item["_id"]),
                "title": item.get("title", "Unknown"),
                "release_date": item.get("release_date"),
                "image": item.get("image", ""),  # Ensure images are included
                "media_type": collection_name,
            })

    return today_releases

