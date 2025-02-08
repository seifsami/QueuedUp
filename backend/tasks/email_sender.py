import os
import sendgrid
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

# Load environment variables (for local testing)
load_dotenv()

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
SENDER_EMAIL = "releases@queuedup.co"  # This should match your verified sender

def send_email(to_email, subject, html_content):
    """Send an email using SendGrid."""
    if not SENDGRID_API_KEY:
        print("Error: SENDGRID_API_KEY is not set.")
        return False

    sg = sendgrid.SendGridAPIClient(SENDGRID_API_KEY)
    
    email = Mail(
        from_email=SENDER_EMAIL,
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )

    try:
        response = sg.send(email)
        print(f"Email sent to {to_email}: Status {response.status_code}")
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False
