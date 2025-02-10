from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
import redis

try:
    import redis
    redis_url = os.getenv("REDIS_URL")
    redis_client = redis.from_url(redis_url, decode_responses=True,ssl_cert_reqs=None) if redis_url else None
    if redis_client:
        print("✅ Redis connected successfully!")
    else:
        print("⚠️ Redis is not configured. Caching is disabled.")
except ImportError:
    print("⚠️ Redis module not found. Caching is disabled.")
    redis_client = None

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
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




app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(user_watchlist_blueprint, url_prefix='/watchlist')
app.register_blueprint(media_blueprint, url_prefix='/media')
app.register_blueprint(homepage_blueprint, url_prefix='/homepage')
app.register_blueprint(cron_blueprint, url_prefix='/cron')
app.register_blueprint(search_blueprint, url_prefix='/api')
app.register_blueprint(emailnotifs_blueprint, url_prefix='/api')
app.register_blueprint(request_blueprint, url_prefix='/api')


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
        collection_names = mongo.db.list_collection_names()
        return jsonify({"status": "success", "collections": collection_names}), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
