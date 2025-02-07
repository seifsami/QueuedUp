from flask import Blueprint, jsonify
from tasks.release_query import get_today_releases
from tasks.email_formatter import format_email_content

emailnotifs_blueprint = Blueprint('emailnotifs', __name__)

@emailnotifs_blueprint.route('/send-notifications', methods=['GET'])
def send_notifications():
    """API endpoint to trigger fetching of today's releases and generate email content."""
    try:
        releases = get_today_releases()  # Fetch today's releases
        email_html = format_email_content(releases)  # Generate the email content

        return jsonify({"success": True, "html_preview": email_html}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
