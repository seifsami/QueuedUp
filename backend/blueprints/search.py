from flask import Blueprint, jsonify, request
from bson import ObjectId
from app import mongo
from datetime import datetime

search_blueprint = Blueprint('search', __name__)

# Utility function to clean and serialize results
def clean_result(result):
    """
    Convert ObjectId to string for JSON serialization and remove unwanted fields.
    """
    if "_id" in result:
        result["_id"] = str(result["_id"])
    return result

@search_blueprint.route('/search', methods=['GET'])
def search():
    try:
        # Get query parameters (using both 'query' and 'q')
        query = (request.args.get('query') or request.args.get('q', '')).strip()
        media_type = request.args.get('type', '').strip()
      
        # Ensure a query is provided
        if not query:
            return jsonify({"error": "A search query is required."}), 400

        # Connect to the database
        db = mongo.cx["QueuedUpDBnew"]

        # Define the search pipeline
        def build_pipeline(collection_name, query):
            index_name = f"{collection_name}_search_index"
            
            # Define boost values for relevant fields
            field_boosts = {
                "books": {"title": 10, "author": 3, "series": 5},
                "movies": {"title": 10, "franchise_name": 5},
                "tv_seasons": {"title": 10}
            }
            boosts = field_boosts.get(collection_name, {})
            now = datetime.utcnow()  # current UTC time

            return [
                {
                    "$search": {
                        "index": index_name,
                        "compound": {
                            "should": [
                                {
                                    "autocomplete": {
                                        "query": query,
                                        "path": field,
                                        "fuzzy": {"maxEdits": 2},  # Allows minor typos
                                        "score": {"boost": {"value": boost}}
                                    }
                                }
                                for field, boost in boosts.items()
                            ]
                        }
                    }
                },
                {
                    "$match": {
                        "$or": [
                            {"release_date": None},  # Keep items with no release date
                            {"release_date": "N/A"},  # Keep explicitly marked as "N/A"
                            {
                                "$expr": {
                                    "$gt": [{"$toDate": "$release_date"}, now]  # Keep valid future release dates
                                }
                            }
                        ]
                    }
                },
                {
                    "$addFields": {
                        "adjusted_score": {
                            "$add": [
                                {"$multiply": [{"$meta": "searchScore"}, 0.8]},  # 80% relevance
                                {"$multiply": [{"$ln": {"$add": ["$hype_score", 1]}}, 0.2]}  # 20% hype score
                            ]
                        }
                    }
                },
                {"$sort": {"adjusted_score": -1}},  # Sort by final score (higher = better)
                {"$limit": 10},  # Limit results to 10
                {
                    "$project": {
                        "title": 1,
                        "image": 1,
                        "release_date": 1,
                        "author": 1,            # Include for books
                        "franchise_name": 1,      # Include for movies
                        "director": 1,          # Include for movies
                        "network_name": 1,      # Include for TV seasons
                        "media_type": {"$literal": collection_name},
                        "slug": 1,
                        "score": {"$meta": "searchScore"},
                        "adjusted_score": 1
                    }
                }
            ]


        # Handle media_type filtering
        pipelines = []
        if media_type and media_type != 'all':
            if media_type not in ['books', 'movies', 'tv_seasons']:
                return jsonify({"error": "Invalid media type."}), 400
            pipelines.append((media_type, build_pipeline(media_type, query)))
        else:
            for collection_name in ['books', 'movies', 'tv_seasons']:
                 pipelines.append((collection_name, build_pipeline(collection_name, query)))

        # Execute the search across collections
        results = []
        for collection_name, pipeline in pipelines:
            collection = db[collection_name]
            raw_results = list(collection.aggregate(pipeline))
            cleaned_results = [clean_result(item) for item in raw_results]
            results.extend(cleaned_results)

        # Sort results by search score in descending order
        results = sorted(results, key=lambda x: x.get('score', 0), reverse=True)

        # Return combined results
        return jsonify(results), 200

    except Exception as e:
        print(f"Error during search: {e}")
        return jsonify({"error": "Internal server error"}), 500
