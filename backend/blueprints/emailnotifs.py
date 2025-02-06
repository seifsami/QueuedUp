from datetime import datetime
from bson import ObjectId
from app import mongo  # Your MongoDB connection
import firebase_admin
from firebase_admin import auth
import smtplib  # or import your email-sending library
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# (Ensure Firebase Admin is initialized somewhere in your app startup code)
# firebase_admin.initialize_app(...)

def send_email_notification(to_email, subject, body):
    """
    Placeholder function to send an email.
    Replace with your actual email-sending logic (e.g. using smtplib or SendGrid).
    """
    # For example, using smtplib:
    sender_email = "youremail@example.com"
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        with smtplib.SMTP('smtp.example.com', 587) as server:
            server.starttls()
            server.login(sender_email, "your_email_password")
            server.send_message(msg)
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

def check_watchlists_and_notify():
    """
    This function checks every user's watchlist in MongoDB.
    For each item whose release date has arrived (i.e. <= current time),
    it retrieves the user's email from Firebase and sends a notification.
    """
    db = mongo.cx["QueuedUpDBnew"]
    watchlist_collection = db.userwatchlist

    now = datetime.utcnow()
    # Query all watchlist items; you could refine this query if needed.
    all_watchlist_items = list(watchlist_collection.find({}))

    # Group items by user_id
    watchlists_by_user = {}
    for item in all_watchlist_items:
        watchlists_by_user.setdefault(item["user_id"], []).append(item)

    for user_id, items in watchlists_by_user.items():
        # Find items with release_date in the past or today
        items_to_notify = []
        for item in items:
            # Retrieve media details from the appropriate collection
            collection = db[item['media_type']]
            media = collection.find_one({"_id": ObjectId(item['item_id'])})
            if not media:
                continue

            # Assume media["release_date"] is stored as a string; convert it.
            try:
                release_date = datetime.strptime(media["release_date"], "%a, %d %b %Y %H:%M:%S %Z")
            except Exception:
                # Fallback if already stored as a date or different format:
                release_date = media.get("release_date")
                if not isinstance(release_date, datetime):
                    continue

            if release_date <= now:
                items_to_notify.append({
                    "title": media.get("title", "Unknown Title"),
                    "release_date": release_date,
                    "media_type": item["media_type"],
                })

        if items_to_notify:
            try:
                # Get the user's email via Firebase Admin
                user_record = auth.get_user(user_id)
                user_email = user_record.email
            except Exception as e:
                print(f"Failed to get email for user {user_id}: {e}")
                continue

            # Construct the email content.
            subject = "Your Watchlist Releases Have Arrived!"
            body = "Hello,\n\nThe following items in your watchlist have now released:\n"
            for notify_item in items_to_notify:
                body += f"- {notify_item['title']} ({notify_item['media_type']}) released on {notify_item['release_date'].strftime('%Y-%m-%d')}\n"
            body += "\nEnjoy your viewing/reading!\n\n--QueuedUp Team"

            # Send the email
            send_email_notification(user_email, subject, body)
            print(f"Notification sent to {user_email} for {len(items_to_notify)} items.")

if __name__ == "__main__":
    check_watchlists_and_notify()
