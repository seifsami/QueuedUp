# Assuming the file is named media.py in the blueprints directory
from flask import Blueprint, jsonify, current_app
from bson import ObjectId
from app import mongo
import json
import time
import datetime
import random

media_blueprint = Blueprint('media_blueprint', __name__)

@media_blueprint.route('/<media_type>/<item_id>', methods=['GET'])
def get_media_item(media_type, item_id):
    try:
        db = mongo.cx["QueuedUpDBnew"]
        collection = db[media_type]
        fields_to_include = {}

        if media_type == 'books':
            fields_to_include = {'title': 1, 'author': 1, 'release_date': 1, 'image': 1, 'description': 1, 'series': 1}
        elif media_type == 'movies':
            fields_to_include = {'title': 1, 'director': 1, 'release_date': 1, 'image': 1, 'description': 1, 'genres': 1, 'franchise_name': 1}
        elif media_type == 'tv_seasons':
            fields_to_include = {'title': 1, 'network_name': 1, 'release_date': 1, 'image': 1, 'description': 1, 'genres': 1, 'name': 1}

        print(f"Searching in collection: {media_type} with ID: {item_id}")
        item = collection.find_one({"_id": ObjectId(item_id)}, fields_to_include)

        if item:
            item['_id'] = str(item['_id'])  # Include _id in the response
            item['media_type'] = media_type  # Add media_type to response
            return jsonify(item), 200
        else:
            return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@media_blueprint.route('/slug/<media_type>/<slug>', methods=['GET'])
def get_media_by_slug(media_type, slug):
    """Fetches a media item using its slug instead of ID."""
    try:
        db = mongo.cx["QueuedUpDBnew"]
        collection = db[media_type]
        redis_client = current_app.config.get("REDIS_CLIENT")  # ✅ Get Redis client

        # ✅ Check Redis cache for media details first (6-hour cache)
        media_cache_key = f"cached_media:{media_type}:{slug}"
        cached_media = redis_client.get(media_cache_key) if redis_client else None

        if cached_media:
            print(f"⚡ Cache hit for media: {slug}")
            return jsonify(json.loads(cached_media)), 200

        fields_to_include = {}

        # 🔹 Define the fields we want to return for each media type
        if media_type == 'books':
            fields_to_include = {
                'title': 1, 'author': 1, 'release_date': 1, 'image': 1, 
                'description': 1, 'series': 1, 'slug': 1, 'language': 1, 'publisher': 1, 'hype_score': 1
            }
        elif media_type == 'movies':
            fields_to_include = {
                'title': 1, 'director': 1, 'release_date': 1, 'image': 1, 
                'description': 1, 'genres': 1, 'franchise_name': 1, 'slug': 1, 'hype_score': 1
            }
        elif media_type == 'tv_seasons':
            fields_to_include = {
                'title': 1, 'network_name': 1, 'release_date': 1, 'image': 1, 
                'description': 1, 'genres': 1, 'slug': 1, 'spoken_languages': 1, 'hype_score': 1
            }

        print(f"Searching in collection: {media_type} with Slug: {slug}")
        item = collection.find_one({"slug": slug}, fields_to_include)

        if item:
            item['_id'] = str(item['_id'])  # Convert ObjectId to string
            item['media_type'] = media_type  # Add media_type to response

            # 🔹 Standardize field names for consistency in the frontend
            item['creator'] = item.get('author') or item.get('director') or item.get('network_name')
            item['creator_label'] = "Author" if media_type == "books" else "Director" if media_type == "movies" else "Network"

            # ✅ Check Redis cache for hype percentage first (24-hour cache)
            hype_cache_key = f"hype_meter:{media_type}:{item['_id']}"
            cached_hype = redis_client.get(hype_cache_key) if redis_client else None

            if cached_hype:
                print(f"⚡ Using cached Hype Meter for {item['_id']}")
                item["hype_meter_percentage"] = int(cached_hype)
            else:
                # ✅ Get raw hype score from MongoDB
                print(f"⚡ Retrieved hype_score for {slug}: {item.get('hype_score')}")
                raw_hype_score = item.get("hype_score", 0)  # Default to 0 if missing
                

                # ✅ Convert raw hype score to percentage
                if raw_hype_score is None or raw_hype_score == 0:
                    hype_meter_percentage = random.choice([25, 40])  # Random assignment for 0/missing values
                elif raw_hype_score >= 0.8:
                    hype_meter_percentage = 100
                elif raw_hype_score >= 0.5:
                    hype_meter_percentage = 80
                elif raw_hype_score >= 0.3:
                    hype_meter_percentage = 60
                elif raw_hype_score >= 0.1:
                    hype_meter_percentage = 40
                else:
                    hype_meter_percentage = 25

                # ✅ Cache hype percentage for 24 hours
                if redis_client:
                    redis_client.setex(hype_cache_key, 86400, hype_meter_percentage)

                item["hype_meter_percentage"] = hype_meter_percentage

            # 🔹 Format release date properly (remove timestamp)
            if 'release_date' in item and isinstance(item['release_date'], datetime.datetime):
                item['release_date'] = item['release_date'].isoformat()  # Convert datetime to string

            # ✅ Convert datetime fields to JSON serializable format before caching
            item = json.loads(json.dumps(item, default=serialize_datetime))

            # ✅ Cache media details for 6 hours
            if redis_client:
                redis_client.setex(media_cache_key, 21600, json.dumps(item))  # 6-hour cache

            return jsonify(item), 200
        else:
            return jsonify({"error": "Media not found"}), 404
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


    



@media_blueprint.route('/recommendations/<media_type>/<item_id>', methods=['GET'])
def get_recommendations(media_type, item_id):
    """Finds media that users also have in their watchlist, filtered by media type."""
    try:
        db = current_app.extensions['pymongo'].cx["QueuedUpDBnew"]
        watchlist_collection = db["userwatchlist"]

        # ✅ Use Redis from Flask app config
        redis_client = current_app.config.get("REDIS_CLIENT")

        item_id = item_id.strip()  # Remove any whitespace/newlines
        cache_key = f"cached_recommendations:{media_type}:{item_id}"

        # ✅ Step 1: Check Redis Cache
        if redis_client:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                print(f"⚡ Returning cached recommendations for {item_id}")
                return jsonify({"recommendations": json.loads(cached_data)}), 200

        print(f"📌 Querying MongoDB for item_id: {item_id}")

        # Step 2: Find all users who have this item in their watchlist
        users_with_item = list(watchlist_collection.find(
            {"item_id": item_id, "media_type": media_type}, {"user_id": 1}
        ))
        user_ids = [user["user_id"] for user in users_with_item]

        recommendations = []
        if user_ids:
            print(f"👥 Found {len(user_ids)} users with this item.")

            # Step 3: Find other items these users also have
            recommended_items = list(watchlist_collection.aggregate([
                {"$match": {"user_id": {"$in": user_ids}, "media_type": media_type}},
                {"$group": {"_id": "$item_id", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 4}
            ]))

            print(f"🔎 Found {len(recommended_items)} recommended items before filtering.")

            for rec in recommended_items:
                try:
                    query_id = ObjectId(rec["_id"]) if ObjectId.is_valid(rec["_id"]) else rec["_id"]

                    # ✅ Ensure we exclude the current item
                    if str(query_id) == item_id:
                        print(f"🚨 Skipping current item {query_id}")
                        continue

                    media_item = db[media_type].find_one({"_id": query_id}, {"title": 1, "image": 1, "slug": 1, "media_type": 1})
                    if media_item:
                        media_item["_id"] = str(media_item["_id"])
                        recommendations.append(media_item)
                except Exception as e:
                    print(f"❌ Error fetching media item: {str(e)}")

        # Step 4: If we have fewer than 5 recommendations, add random ones
        if len(recommendations) < 4:
            missing_count = 4 - len(recommendations)
            print(f"⚠️ Not enough recommendations ({len(recommendations)} found), adding {missing_count} random items.")

            random_items = list(db[media_type].aggregate([
                {"$match": {"_id": {"$ne": ObjectId(item_id)}}},  # Exclude the current item
                {"$sample": {"size": missing_count}}
            ]))

            for item in random_items:
                if item not in recommendations:
                    item["_id"] = str(item["_id"])
                    recommendations.append(item)

        print(f"✅ Returning {len(recommendations)} recommendations.")

        # ✅ Step 5: Store Recommendations in Redis (6 Hours)
    

        def serialize_datetime(obj):
            """Convert datetime objects to ISO format for JSON serialization."""
            if isinstance(obj, datetime.datetime):
                return obj.isoformat()
            raise TypeError("Type not serializable")

        # ✅ Store Recommendations in Redis (6 Hours), handling datetime
        if redis_client:
            redis_client.setex(cache_key, 21600, json.dumps(recommendations, default=serialize_datetime))

        return jsonify({"recommendations": recommendations}), 200
    except Exception as e:
        print(f"❌ Error in recommendations: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
