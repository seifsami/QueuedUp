from datetime import datetime, timedelta
from bson import ObjectId
from app import mongo  # Ensure this correctly imports the MongoDB instance

def get_today_releases():
    """Fetch media items releasing today from MongoDB"""
    db = mongo.cx["QueuedUpDBnew"]
    
    # Get the current UTC date at midnight
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow_start = today_start + timedelta(days=1)

    collections = ['books', 'movies', 'tv_seasons']  # Books first for monetization
    today_releases = {"books": [], "movies": [], "tv_seasons": []}

    for collection_name in collections:
        collection = db[collection_name]

        # Query for items where release_date is today
        items = list(collection.find({
            "release_date": {
                "$gte": today_start,
                "$lt": tomorrow_start
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


def get_users_with_watchlist_items(releasing_items):
    """Find users who have today's releasing items on their watchlist"""
    db = mongo.cx["QueuedUpDBnew"]
    users_to_notify = {}

    for media_type, items in releasing_items.items():
        for item in items:
            item_id = str(item["_id"])
            
            # Find users who have this item in their watchlist
            watchlist_entries = db.userwatchlist.find({"item_id": item_id, "media_type": media_type})

            for entry in watchlist_entries:
                user_id = entry["user_id"]
                
                # Fetch user email
                user = db.users.find_one({"_id": ObjectId(user_id)})
                if not user or "email" not in user:
                    continue
                
                user_email = user["email"]

                if user_email not in users_to_notify:
                    users_to_notify[user_email] = {"books": [], "movies": [], "tv_seasons": []}
                
                # Format item details for JSON response
                formatted_item = {
                    "title": item.get("title", "Unknown Title"),
                    "image": item.get("image", ""),
                    "release_date": item.get("release_date", "Unknown Date"),
                }

                if media_type == "books":
                    formatted_item["author"] = item.get("author", "Unknown Author")
                elif media_type == "movies":
                    formatted_item["director"] = item.get("director", "Unknown Director")
                elif media_type == "tv_seasons":
                    formatted_item["network_name"] = item.get("network_name", "Unknown Network")

                users_to_notify[user_email][media_type].append(formatted_item)

    return users_to_notify
