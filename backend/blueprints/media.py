# Assuming the file is named media.py in the blueprints directory
from flask import Blueprint, jsonify, current_app
from bson import ObjectId
from app import mongo
import json
import time
import datetime
import random

def serialize_datetime(obj):
    """Convert datetime objects to ISO format for JSON serialization."""
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    raise TypeError("Type not serializable")



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

        fields_to_include = {
            'books': {'title': 1, 'author': 1, 'release_date': 1, 'image': 1, 'description': 1, 'series': 1, 'slug': 1, 'language': 1, 'publisher': 1, 'hype_score': 1},
            'movies': {'title': 1, 'director': 1, 'release_date': 1, 'image': 1, 'description': 1, 'genres': 1, 'franchise_name': 1, 'slug': 1, 'hype_score': 1},
            'tv_seasons': {'title': 1, 'network_name': 1, 'release_date': 1, 'image': 1, 'description': 1, 'genres': 1, 'slug': 1, 'spoken_languages': 1, 'hype_score': 1}
        }.get(media_type, {})

        print(f"Searching in collection: {media_type} with Slug: {slug}")
        item = collection.find_one({"slug": slug}, fields_to_include)

        if item:
            item['_id'] = str(item['_id'])
            item['media_type'] = media_type
            item['creator'] = item.get('author') or item.get('director') or item.get('network_name')
            item['creator_label'] = "Author" if media_type == "books" else "Director" if media_type == "movies" else "Network"

            # ✅ Convert all datetime fields
            for key, value in item.items():
                if isinstance(value, datetime.datetime):
                    item[key] = value.isoformat()

            # ✅ Store in Redis safely
            redis_client.setex(media_cache_key, 21600, json.dumps(item))

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
        redis_client = current_app.config.get("REDIS_CLIENT")

        item_id = item_id.strip()
        cache_key = f"cached_recommendations:{media_type}:{item_id}"

        if redis_client:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                print(f"⚡ Returning cached recommendations for {item_id}")
                return jsonify({"recommendations": json.loads(cached_data)}), 200

        users_with_item = list(watchlist_collection.find({"item_id": item_id, "media_type": media_type}, {"user_id": 1}))
        user_ids = [user["user_id"] for user in users_with_item]

        recommendations = []
        if user_ids:
            recommended_items = list(watchlist_collection.aggregate([
                {"$match": {"user_id": {"$in": user_ids}, "media_type": media_type}},
                {"$group": {"_id": "$item_id", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 5}
            ]))

            for rec in recommended_items:
                try:
                    query_id = ObjectId(rec["_id"])
                except Exception:
                    query_id = rec["_id"]

                media_item = db[media_type].find_one({"_id": query_id}, {"title": 1, "image": 1, "slug": 1, "media_type": 1})
                if media_item:
                    media_item["_id"] = str(media_item["_id"])
                    recommendations.append(media_item)

        for rec in recommendations:
            for key, value in rec.items():
                if isinstance(value, datetime.datetime):
                    rec[key] = value.isoformat()

        if redis_client:
            redis_client.setex(cache_key, 21600, json.dumps(recommendations))

        return jsonify({"recommendations": recommendations}), 200
    except Exception as e:
        print(f"❌ Error in recommendations: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
