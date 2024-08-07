from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://seifsami:beesknees@queuedupdbnew.lsrfn46.mongodb.net/?retryWrites=true&w=majority&appName=QueuedUpDBnew"
mongo = PyMongo(app)

from blueprints.user import user_blueprint
from blueprints.watchlist import user_watchlist_blueprint
from blueprints.media import media_blueprint


app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(user_watchlist_blueprint, url_prefix='/watchlist')
app.register_blueprint(media_blueprint, url_prefix='/media')







@app.route('/')
def hello():
    return 'Hello, QueuedUp!'

@app.route('/test_mongodb')
def test_mongodb():
    try:
        db_list = mongo.cx.list_database_names()
        return jsonify(db_list)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/test_mongo_connection')
def test_mongo_connection():
    try:
        # Try to access a known collection
        collection_names = mongo.db.list_collection_names()
        return jsonify({"status": "success", "collections": collection_names}), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

@app.route('/search')
def search():
    query = request.args.get('query')

    try:
        db = mongo.cx.QueuedUpDB

        # Search in movies collection
        movies_results = db.movies.aggregate([
            {
                "$search": {
                    "text": {
                        "query": query,
                        "path": {"wildcard": "*"}
                    }
                }
            }
        ])

        # Search in tv_seasons collection
        tv_results = db.tv_seasons.aggregate([
            {
                "$search": {
                    "text": {
                        "query": query,
                        "path": {"wildcard": "*"}
                    }
                }
            }
        ])

        # Function to convert ObjectId to string
        def convert_objectid(doc):
            doc['_id'] = str(doc['_id'])
            return doc

        # Apply conversion to each document
        combined_results = [convert_objectid(doc) for doc in list(movies_results)] + [convert_objectid(doc) for doc in list(tv_results)]
        return jsonify(combined_results)
    except Exception as e:
        return jsonify({"error": str(e)})
    

if __name__ == '__main__':
    app.run(debug=True)
