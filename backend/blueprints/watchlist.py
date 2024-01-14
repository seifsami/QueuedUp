from flask import Blueprint, jsonify
from bson import ObjectId
from app import mongo

user_watchlist_blueprint = Blueprint('user_watchlist_blueprint', __name__)



@user_watchlist_blueprint.route('/<user_id>', methods=['GET'])
def get_user_watchlist(user_id):
    db = mongo.cx["QueuedUpDBnew"]
    user_watchlist = db.userwatchlist.find({"user_id": user_id})
    detailed_watchlist = []

    for item in user_watchlist:
        collection = db[item['media_type']]
        media_details = collection.find_one({"_id": ObjectId(item['item_id'])}) 
        
        # Tailor the details based on media type
        if item['media_type'] == 'books':
            # Extract book-specific details
            detailed_item = {
                "title": media_details.get("title"),
                "author": media_details.get("author"),
                "image": media_details.get("image"),
                "release_date": media_details.get("release_date")
            }
        elif item['media_type'] == 'movies':
            # Extract movie-specific details
            detailed_item = {
                "title": media_details.get("title"),
                "director": media_details.get("director"),
                "image": media_details.get("image"),
                "release_date": media_details.get("release_date")
            }
        elif item['media_type'] == 'tv_seasons':
            # Extract movie-specific details
            detailed_item = {
                "title": media_details.get("title"),
                "network_name": media_details.get("network_name"),
                "image": media_details.get("image"),
                "release_date": media_details.get("release_date")
            }

        detailed_watchlist.append(detailed_item)

    return jsonify(detailed_watchlist), 200