from flask import Blueprint, request, jsonify
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime, timezone
import requests
from app import mongo



def get_user_country():
    """Gets the user's country using request IP or a fallback IP service."""
    try:
        # Get the user's IP from the request
        user_ip = request.headers.get("X-Forwarded-For", request.remote_addr)
        if not user_ip:
            return "US"  # Default if no IP found
        
        # Call IP-API to get the country code
        response = requests.get(f"http://ip-api.com/json/{user_ip}")
        data = response.json()
        
        # Check if the API returned a valid response
        if data.get("status") == "fail":
            print(f"IP-API Error: {data.get('message')}")
            return "US"

        return data.get("countryCode", "US")
    
    except Exception as e:
        print("Error getting country:", e)
        return "US"  # Default fallback to US



user_blueprint = Blueprint('user_blueprint', __name__)



@user_blueprint.route('/register', methods=['POST'])
def register_user():
    print("Register user endpoint hit")
    data = request.json
    print("Received data:", data) 
    db = mongo.cx["QueuedUpDBnew"]  # Replace with your actual database name
    users = db.users


    # Basic validation
    if not data.get('email') or not data.get('firebase_id'):
        return jsonify({"error": "Missing email or Firebase ID"}), 400

    country_code = get_user_country()

    new_user = {
        "email": data['email'],
        "firebase_id": data['firebase_id'],
        "first_name": data.get('first_name'),  # .get() will return None if the field is not present
        "last_name": data.get('last_name'),
        "username": data.get('username'),
        "phone_number": data.get('phone_number', None),
        "notification_preferences": data.get('notification_preferences', []),
        "created_at": datetime.now(timezone.utc),
        "country": country_code,
        "utm_source": data.get('utm_source', ''),  # ✅ Store UTM source
        "utm_medium": data.get('utm_medium', ''),  # ✅ Store UTM medium
        "utm_campaign": data.get('utm_campaign', '')  # ✅ Store UTM campaign
        # Add other fields as per your User model
    }


    try:
        # Save the new user to the database
        users.insert_one(new_user)
        return jsonify({"message": "User registered successfully"}), 201
    except DuplicateKeyError:
        # Handle the duplicate key error (e.g., email already exists)
        return jsonify({"error": "User with the given email already exists"}), 409
    
@user_blueprint.route('/update/<firebase_id>', methods=['PUT'])
def update_user(firebase_id):
    data = request.json
    db = mongo.cx["QueuedUpDBnew"]  # Replace with your actual database name
    users = db.users
    
   

    # Create an update object
    update_data = {}
    if 'first_name' in data:
        update_data['first_name'] = data['first_name']
    if 'last_name' in data:
        update_data['last_name'] = data['last_name']
    if 'email' in data:
        update_data['email'] = data['email']
    if 'phone_number' in data:
        update_data['phone_number'] = data['phone_number']
    if 'username' in data:
        update_data['username'] = data['username']
    if 'notification_preferences' in data:
        update_data['notification_preferences'] = data['notification_preferences']

    
    
    # Add other fields as needed

    # Perform the update
    result = users.update_one({"firebase_id": firebase_id}, {"$set": update_data})

    if result.matched_count:
        return jsonify({"message": "User updated successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404


@user_blueprint.route('/profile/<firebase_id>', methods=['GET'])
def get_user(firebase_id):
    db = mongo.cx["QueuedUpDBnew"]  # Replace with your actual database name
    users = db.users

    # Query the user
    user = users.find_one({"firebase_id": firebase_id})

    if user:
        user.pop('_id', None)  # Remove the _id field or convert it to a string if needed
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404
