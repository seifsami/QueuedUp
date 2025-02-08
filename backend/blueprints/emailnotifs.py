from flask import Blueprint, jsonify
from tasks.release_query import get_today_releases, get_users_with_watchlist_items
from tasks.email_formatter import format_email_content
from tasks.email_sender import send_email

emailnotifs_blueprint = Blueprint('emailnotifs', __name__)

@emailnotifs_blueprint.route('/preview-notifications', methods=['GET'])
def preview_notifications():
    """API endpoint to fetch today's releases and show a preview of per-user notifications."""
    try:
        # Get all items releasing today
        today_releases = get_today_releases()
        
        # Get users who have those items on their watchlist
        users_to_notify = get_users_with_watchlist_items(today_releases)

        # Only include users who actually have items to notify about
        filtered_users = {email: items for email, items in users_to_notify.items() if any(items.values())}

        return jsonify(filtered_users), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
