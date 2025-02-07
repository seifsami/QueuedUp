from datetime import datetime
from bson import ObjectId
from app import mongo  # Ensure this correctly imports the MongoDB instance

def get_today_releases():
    """Fetch media items releasing today from MongoDB"""
    db = mongo.cx["QueuedUpDBnew"]
    today = datetime.utcnow().strftime('%Y-%m-%d')

    collections = ['books', 'movies', 'tv_seasons']  # Books first
    today_releases = {"books": [], "movies": [], "tv_seasons": []}

    for collection_name in collections:
        collection = db[collection_name]
        items = list(collection.find({"release_date": today}, {
            "_id": 1,
            "title": 1,
            "release_date": 1,
            "image": 1,  # Include images
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
