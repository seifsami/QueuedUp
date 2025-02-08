from flask import Blueprint, jsonify
from tasks.release_query import get_today_releases
from tasks.email_formatter import format_email_content
from tasks.email_sender import send_email
import firebase_admin
from firebase_admin import auth

emailnotifs_blueprint = Blueprint('emailnotifs', __name__)

@emailnotifs_blueprint.route('/send-notifications', methods=['GET'])
def send_notifications():
    """API endpoint to fetch today's releases and send email notifications."""
    try:
        releases = get_today_releases()
        if not any(releases.values()):  # Check if there are no releases today
            return jsonify({"success": False, "message": "No releases today."}), 200

        email_content = format_email_content(releases)

        # Fetch all users from Firebase Auth
        users = auth.list_users().iterate_all()
        emails_sent = 0

        for user in users:
            if user.email:
                success = send_email(user.email, "Your QueuedUp Releases for Today!", email_content)
                if success:
                    emails_sent += 1

        return jsonify({"success": True, "emails_sent": emails_sent}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
