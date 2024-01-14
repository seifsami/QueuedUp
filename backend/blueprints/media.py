# Assuming the file is named media.py in the blueprints directory
from flask import Blueprint, jsonify, current_app
from flask_pymongo import PyMongo


media_blueprint = Blueprint('media_blueprint', __name__)


@media_blueprint.route('/<media_type>/<item_id>', methods=['GET'])
def get_media_item(media_type, item_id):
    db = mongo.cx["QueuedUpDBnew"]
    collection = db[media_type]
    fields_to_include = {}

    if media_type == 'books':
        fields_to_include = {'title': 1, 'author': 1, 'release_date': 1, 'image': 1,  'description': 1, 'series': 1, }  # Add other necessary fields
    elif media_type == 'movies':
        fields_to_include = {'title': 1, 'director': 1, 'release_date': 1, 'image': 1, 'description': 1, 'genres': 1, 'franchise_name': 1}  # Add other necessary fields
    elif media_type == 'tv_seasons':
        fields_to_include = {'title': 1, 'network_name': 1, 'release_date': 1, 'image': 1,  'description': 1, 'genres': 1, 'name': 1 }  # Add other necessary fields
  

    item = collection.find_one({"_id": ObjectId(item_id)}, fields_to_include)

    if item:
        item.pop('_id', None)
        return jsonify(item), 200
    else:
        return jsonify({"error": "Item not found"}), 404