from flask import Blueprint, jsonify
from tasks.release_query import get_today_releases
from tasks.email_formatter import format_email_content
from tasks.email_sender import send_email


emailnotifs_blueprint = Blueprint('emailnotifs', __name__)

#

# **ONLY YOUR EMAIL FOR TESTING**
TEST_EMAIL = "sseleem1601@gmail.com"  # Replace this with your actual email

@emailnotifs_blueprint.route('/send-notifications', methods=['GET'])
def send_notifications():
    """API endpoint to fetch today's releases and send a test email."""
    try:
        releases = get_today_releases()
        if not any(releases.values()):  # No releases today
            return jsonify({"success": False, "message": "No releases today."}), 200

        email_content = format_email_content(releases)

        # Send only to your test email
        success = send_email(TEST_EMAIL, "Your QueuedUp Releases for Today!", email_content)
        
        if success:
            return jsonify({"success": True, "message": f"Test email sent to {TEST_EMAIL}"}), 200
        else:
            return jsonify({"success": False, "message": "Failed to send test email"}), 500

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
