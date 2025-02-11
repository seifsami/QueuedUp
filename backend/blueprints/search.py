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
                    {
                        "$search": {
                            "index": index_name,
                            "compound": {
                                "should": [
                                    # 🔥 1. Exact title match (HIGH BOOST)
                                    {
                                        "text": {
                                            "query": query,
                                            "path": "title",
                                            "score": { "boost": { "value": 15 } }  # ✅ Prioritize exact title matches
                                        }
                                    },
                                    # 🔥 2. Prefix match (STARTS WITH the query)
                                    {
                                        "phrase": {
                                            "query": query,
                                            "path": "title",
                                            "position": 0,  # ✅ Ensures match starts at the beginning of the title
                                            "score": { "boost": { "value": 10 } }
                                        }
                                    },
                                    # 🔥 3. Partial text match (Lower weight)
                                    {
                                        "autocomplete": {
                                            "query": query,
                                            "path": ["title", "author", "franchise_name"],
                                            "fuzzy": { "maxEdits": 1 },  # ✅ Reduce fuzzy edits (less randomness)
                                            "score": { "boost": { "value": 5 } }
                                        }
                                    },
                                    # 🔥 4. General match on author, franchise (Lowest Weight)
                                    {
                                        "text": {
                                            "query": query,
                                            "path": ["author", "franchise_name"],
                                            "score": { "boost": { "value": 3 } }
                                        }
                                    }
                                ],
                                "minimumShouldMatch": 1  # ✅ Ensures at least one condition must match
                            }
                        }
                    }
                },
               {
            "$match": {
                "$or": [
                    {"release_date": None},  
                    {"release_date": "N/A"},  
                    {
                        "$and": [
                            {"release_date": {"$exists": True, "$ne": None}},  # ✅ Ensure date exists
                            {
                                "$expr": {
                                    "$gt": [{"$toDate": "$release_date"}, now]  # ✅ Only convert valid dates
                                }
                            }
                        ]
                    }
                ]
            }
        },
                {
                    "$addFields": {
                        "adjusted_score": {
                            "$add": [
                                {"$multiply": [{"$meta": "searchScore"}, 0.8]},  
                                {
                                    "$multiply": [
                                        {"$ln": {"$add": [{"$ifNull": ["$hype_score", 0]}, 1]}},  # ✅ Replace None with 0
                                        0.2
                                    ]
                                }
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
        all_results = []
        for collection_name, pipeline in pipelines:
            try:
                collection = db[collection_name]
                print(f"🚀 Running search on {collection_name} with pipeline: {pipeline}")
                raw_results = list(collection.aggregate(pipeline))
                cleaned_results = [clean_result(item) for item in raw_results]
                all_results.extend(cleaned_results)
            except Exception as e:
                print(f"❌ ERROR: Failed to query {collection_name} | {str(e)}")
                return jsonify({"error": f"Search failed for {collection_name}", "details": str(e)}), 500

        # 🔥 Sort merged results by final weighted score (searchScore + hype_score)
        all_results = sorted(all_results, key=lambda x: x.get('adjusted_score', 0), reverse=True)

        # 🔥 Return only the top 10 results
        return jsonify(all_results[:10]), 200

    except Exception as e:
        print(f"❌ Critical Error in Search: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500