# Assuming the file is named media.py in the blueprints directory
from flask import Blueprint, jsonify
from bson import ObjectId
from app import mongo

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
        fields_to_include = {}

        # 🔹 Define the fields we want to return for each media type
        if media_type == 'books':
            fields_to_include = {
                'title': 1, 'author': 1, 'release_date': 1, 'image': 1, 
                'description': 1, 'series': 1, 'slug': 1, 'language': 1, 'publisher': 1
            }
        elif media_type == 'movies':
            fields_to_include = {
                'title': 1, 'director': 1, 'release_date': 1, 'image': 1, 
                'description': 1, 'genres': 1, 'franchise_name': 1, 'slug': 1
            }
        elif media_type == 'tv_seasons':
            fields_to_include = {
                'title': 1, 'network_name': 1, 'release_date': 1, 'image': 1, 
                'description': 1, 'genres': 1, 'slug': 1, 'spoken_languages': 1
            }

        print(f"Searching in collection: {media_type} with Slug: {slug}")
        item = collection.find_one({"slug": slug}, fields_to_include)

        if item:
            item['_id'] = str(item['_id'])  # Convert ObjectId to string
            item['media_type'] = media_type  # Add media_type to response

            # 🔹 Standardize field names for consistency in the frontend
            item['creator'] = item.get('author') or item.get('director') or item.get('network_name')
            item['creator_label'] = "Author" if media_type == "books" else "Director" if media_type == "movies" else "Network"

            # 🔹 Format release date properly (remove timestamp)
            if 'release_date' in item and isinstance(item['release_date'], str):
                item['release_date'] = item['release_date'].split(' ')[1:4]  # Extract only Date (no timestamp)
                item['release_date'] = " ".join(item['release_date'])  # Convert list back to string

            return jsonify(item), 200
        else:
            return jsonify({"error": "Media not found"}), 404
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
