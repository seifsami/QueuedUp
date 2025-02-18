import os
import sendgrid
from sendgrid.helpers.mail import Mail, Email
from dotenv import load_dotenv

load_dotenv()

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
SENDER_EMAIL = "releases@queuedup.co"  # Must be a verified sender

def send_email(to_email, subject, html_content):
    """Send an email using SendGrid."""
    if not SENDGRID_API_KEY:
        print("⚠️ Error: SENDGRID_API_KEY is not set.")
        return False

    sg = sendgrid.SendGridAPIClient(SENDGRID_API_KEY)
    
    from_email = Email(SENDER_EMAIL, name="QueuedUp")
    email = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )

    try:
        response = sg.send(email)
        print(f"📩 Email sent to {to_email}: Status {response.status_code}")
        return response.status_code in [200, 202]
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
        return False
