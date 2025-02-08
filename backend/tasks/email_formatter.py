import os

# Define the path to the email template file
EMAIL_TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "../templates/email_template.html")

# Default images in case media item has no image
DEFAULT_IMAGES = {
    "books": "https://queuedup-backend-6d9156837adf.herokuapp.com/static/heather-green-iB9YTvq2rZ8-unsplash.jpg",
    "movies": "https://queuedup-backend-6d9156837adf.herokuapp.com/static/denise-jans-9lTUAlNB87M-unsplash.jpg",
    "tv_seasons": "https://queuedup-backend-6d9156837adf.herokuapp.com/static/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
}


def build_email_section(items, section_title, media_type):
    """Generates HTML for each section (Movies, TV, Books)"""
    if not items:
        return ""

    section_html = f'<div class="section-title">{section_title}</div>'
    
    for item in items:
        image_url = item.get("image") or DEFAULT_IMAGES[media_type]
        section_html += f"""
        <div class="release-item">
            <img src="{image_url}" alt="{item['title']}">
            <div>
                <div class="release-title">{item['title']}</div>
                {f'<a href="https://www.amazon.com/s?k={item["title"].replace(" ", "+")}&tag=queuedup0f-20" class="cta-button"> Buy on Amazon</a>' if media_type == "books" else ""}
            </div>
        </div>
        """
    
    return section_html

def format_email_content(releases):
    """Formats today's releases using an external HTML template with dynamic content"""
    try:
        with open(EMAIL_TEMPLATE_PATH, "r", encoding="utf-8") as template_file:
            email_html = template_file.read()
    except FileNotFoundError:
        return "<p>Error: Email template not found.</p>"

    # Generate dynamic sections
    books_html = build_email_section(releases["books"], "📚 Books Releasing Today", "books")
    movies_html = build_email_section(releases["movies"], "🎬 Movies Releasing Today", "movies")
    tv_html = build_email_section(releases["tv_seasons"], "📺 TV Shows Releasing Today", "tv_seasons")
    

    # Replace placeholders with actual HTML content
    email_html = email_html.replace("{{books_section}}", books_html)
    email_html = email_html.replace("{{movies_section}}", movies_html)
    email_html = email_html.replace("{{tv_section}}", tv_html)
   
    unsubscribe_link = f'https://queuedup-backend-6d9156837adf.herokuapp.com/unsubscribe?email={user_email}'
    email_html += f'''
        <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
            <p>If you no longer wish to receive these emails, you can 
                <a href="{unsubscribe_link}" style="color: #777; text-decoration: none;">unsubscribe here</a>.
            </p>
        </div>
    '''

    return email_html
