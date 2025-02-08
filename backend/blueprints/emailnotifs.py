from flask import Blueprint, jsonify
from tasks.release_query import get_today_releases, get_users_with_watchlist_items
from tasks.email_formatter import format_email_content
from tasks.email_sender import send_email

emailnotifs_blueprint = Blueprint('emailnotifs', __name__)

#
# 🔍 **Preview API** (No Emails Sent, Just Data)
#
@emailnotifs_blueprint.route('/preview-notifications', methods=['GET'])
def preview_notifications():
    """Fetch today's releases & preview which users would receive notifications."""
    try:
        # 1️⃣ Get all media items releasing today
        today_releases = get_today_releases()
        
        # 2️⃣ Get users who have those items on their watchlist
        users_to_notify = get_users_with_watchlist_items(today_releases)

        # 3️⃣ Remove users who don’t actually have items releasing
        filtered_users = {email: items for email, items in users_to_notify.items() if any(items.values())}

        return jsonify(filtered_users), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


#
# 📩 **Send Emails API** (Actually Sends the Emails)
#
@emailnotifs_blueprint.route('/send-notifications', methods=['GET'])
def send_notifications():
    """Fetch today's releases, find relevant users, and send personalized emails."""
    try:
        today_releases = get_today_releases()
        users_to_notify = get_users_with_watchlist_items(today_releases)

        if not users_to_notify:
            return jsonify({"success": False, "message": "No users have items releasing today."}), 200

        sent_count = 0
        failed_count = 0

        for user_email, user_releases in users_to_notify.items():
            if not any(user_releases.values()):  # Skip users with empty lists
                continue

            # 🛠 Generate a **personalized** email for this user
            email_content = format_email_content(user_releases)

            # 📤 Send the email
            success = send_email(user_email, "Your QueuedUp Releases for Today!", email_content)

            if success:
                sent_count += 1
                print(f"✅ Email successfully sent to {user_email}")
            else:
                failed_count += 1
                print(f"❌ Failed to send email to {user_email}")

        return jsonify({
            "success": True,
            "message": f"Emails sent: {sent_count}, Failed: {failed_count}"
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
@emailnotifs_blueprint.route('/unsubscribe', methods=['GET', 'POST'])
def unsubscribe():
    """Handle unsubscribe requests via form submission."""
    db = mongo.cx["QueuedUpDBnew"]
    unsubscribe_collection = db.unsubscribe  # Unsubscribe collection

    if request.method == 'POST':
        email = request.form.get('email')

        if not email:
            return "Error: No email provided.", 400

        # Ensure we store emails as lowercase strings (case-insensitive)
        email = email.strip().lower()

        # Insert into unsubscribe collection **only if not already unsubscribed**
        if not unsubscribe_collection.find_one({"email": email}):
            unsubscribe_collection.insert_one({"email": email})

        return "You have been unsubscribed from QueuedUp notifications.", 200

    # Render a simple unsubscribe form for GET requests
    return '''
        <html>
            <body style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                <h2>Unsubscribe from QueuedUp Notifications</h2>
                <p>Enter your email to stop receiving updates.</p>
                <form method="POST">
                    <input type="email" name="email" placeholder="Your email" required>
                    <button type="submit">Unsubscribe</button>
                </form>
            </body>
        </html>
    '''

