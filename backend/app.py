from flask import Flask, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://seifsami:beesknees@queuedupdb.nfinrya.mongodb.net/?retryWrites=true&w=majority"

mongo = PyMongo(app)

@app.route('/')
def hello():
    return 'Hello, QueuedUp!'

@app.route('/test_mongodb')
def test_mongodb():
    # Test MongoDB connection
    # For example, list the names of the databases
    db_list = mongo.cx.list_database_names()
    return jsonify(db_list)

if __name__ == '__main__':
    app.run(debug=True)