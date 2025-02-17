from flask import Flask, jsonify, request, Response
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
import redis
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ✅ Ensure `redis_client` is accessible in all routes
redis_client = None

try:
    redis_url = os.getenv("REDIS_URL")
    if redis_url:
        redis_client = redis.from_url(redis_url, decode_responses=True, ssl_cert_reqs=None)
        app.config["REDIS_CLIENT"] = redis_client  # ✅ Store Redis client in Flask config
        print("✅ Redis connected successfully!")
    else:
        print("⚠️ REDIS_URL not found. Redis caching is disabled.")
except Exception as e:
    print(f"❌ Redis connection failed: {e}")
    redis_client = None  # Prevent undefined variable issues
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("🚨 ERROR: MONGO_URI is NOT set in environment variables!")
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)
app.extensions['pymongo'] = mongo  # Ensure the mongo object is available in the app context
from blueprints.user import user_blueprint
from blueprints.watchlist import user_watchlist_blueprint
from blueprints.media import media_blueprint
from blueprints.homepage import homepage_blueprint
from blueprints.cron import cron_blueprint
from blueprints.search import search_blueprint
from blueprints.emailnotifs import emailnotifs_blueprint
from blueprints.requests import request_blueprint
from blueprints.hype import hype_blueprint





app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(user_watchlist_blueprint, url_prefix='/watchlist')
app.register_blueprint(media_blueprint, url_prefix='/media')
app.register_blueprint(homepage_blueprint, url_prefix='/homepage')
app.register_blueprint(cron_blueprint, url_prefix='/cron')
app.register_blueprint(search_blueprint, url_prefix='/api')
app.register_blueprint(emailnotifs_blueprint, url_prefix='/api')
app.register_blueprint(request_blueprint, url_prefix='/api')
app.register_blueprint(hype_blueprint, url_prefix='/hype')


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
    
@app.route('/test_redis')
def test_redis():
    """ ✅ Test if Redis is accessible inside API routes """
    redis_client = app.config.get("REDIS_CLIENT")
    if redis_client:
        return jsonify({"redis_ping": redis_client.ping()}), 200
    return jsonify({"error": "Redis not available"}), 500

@app.route('/test_mongo_connection')
def test_mongo_connection():
    try:
        collection_names = mongo.db.list_collection_names()
        return jsonify({"status": "success", "collections": collection_names}), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

@app.route('/proxy-image/<path:image_path>')
def proxy_image(image_path):
    try:
        # Determine the source and construct the appropriate URL
        if image_path.startswith('tmdb/'):
            # Remove the 'tmdb/' prefix and construct TMDB URL
            tmdb_path = image_path[5:]  # Remove 'tmdb/'
            source_url = f'https://image.tmdb.org/t/p/{tmdb_path}'
        elif image_path.startswith('isbndb/'):
            # Remove the 'isbndb/' prefix and construct ISBNDB URL
            isbndb_path = image_path[7:]  # Remove 'isbndb/'
            source_url = f'https://{isbndb_path}'
            print(f"Constructed ISBNDB URL: {source_url}")  # Log the constructed URL
        else:
            print(f"Invalid image source: {image_path}")  # Log invalid source
            return jsonify({'error': 'Invalid image source'}), 400
        
        # Forward the request to the source
        print(f"Requesting URL: {source_url}")  # Log the request
        response = requests.get(source_url, stream=True)
        print(f"Response status code: {response.status_code}")  # Log the response status
        
        # Check if the request was successful
        if response.status_code == 200:
            # Forward the image response with proper headers
            return Response(
                response.raw.read(),
                content_type=response.headers['content-type'],
                headers={
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=31536000'
                }
            )
        else:
            print(f"Failed to fetch image: {response.status_code}")  # Log failure
            return jsonify({'error': 'Failed to fetch image'}), response.status_code
            
    except Exception as e:
        print(f"Error proxying image: {str(e)}")
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
