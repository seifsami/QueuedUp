from flask import Blueprint, jsonify
from tasks.release_query import get_today_releases

emailnotifs_blueprint = Blueprint('emailnotifs', __name__)

@emailnotifs_blueprint.route('/send-notifications', methods=['GET'])
def send_notifications():
    """API endpoint to trigger fetching of today's releases."""
    try:
        releases = get_today_releases()
        return jsonify({"success": True, "data": releases}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
