import os

# Define the path to the email template file
EMAIL_TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "../templates/email_template.html")

# Default images in case media item has no image
DEFAULT_IMAGES = {
    "books": "https://queuedup-backend-6d9156837adf.herokuapp.com/static/heather-green-iB9YTvq2rZ8-unsplash.jpg",
    "movies": "https://queuedup-backend-6d9156837adf.herokuapp.com/static/denise-jans-9lTUAlNB87M-unsplash.jpg",
    "tv_seasons": "https://queuedup-backend-6d9156837adf.herokuapp.com/static/ajeet-mestry-UBhpOIHnazM-unsplash.jpg",
}

def get_amazon_domain(country_code):
    """
    Get the appropriate Amazon domain for a country code.
    Special cases are handled explicitly, others follow the standard pattern.
    """
    if not country_code:
        return "amazon.com"
        
    country_code = country_code.upper()
    
    # Special cases
    special_domains = {
        "US": "amazon.com",
        "UK": "amazon.co.uk",
        "JP": "amazon.co.jp",
        "BR": "amazon.com.br",
        "AU": "amazon.com.au",
        "IN": "amazon.in",
        "MX": "amazon.com.mx",
        "SG": "amazon.sg",
        "AE": "amazon.ae",
        "SA": "amazon.sa",
    }
    
    if country_code in special_domains:
        return special_domains[country_code]
    
    # European and other countries follow standard pattern (amazon.{country_code.lower()})
    european_countries = ["DE", "FR", "IT", "ES", "NL", "PL", "SE", "TR", "BE", "CA"]
    if country_code in european_countries:
        return f"amazon.{country_code.lower()}"
        
    # Default to US store for unsupported countries
    return "amazon.com"

def get_amazon_url(title, country_code=None):
    """Generate appropriate Amazon URL based on user's country"""
    domain = get_amazon_domain(country_code)
    return f"https://www.{domain}/s?k={title.replace(' ', '+')}&tag=queuedup0f-20"

def build_email_section(items, section_title, media_type, country_code=None):
    """Generates HTML for each section (Movies, TV, Books)"""
    if not items:
        return ""

    section_html = f'<div class="section-title">{section_title}</div>'
    
    for item in items:
        image_url = item.get("image") or DEFAULT_IMAGES[media_type]
        amazon_url = get_amazon_url(item['title'], country_code) if media_type == "books" else ""
        section_html += f"""
        <div class="release-item">
            <img src="{image_url}" alt="{item['title']}">
            <div>
                <div class="release-title">{item['title']}</div>
                {f'<a href="{amazon_url}" class="cta-button">Buy on Amazon</a>' if media_type == "books" else ""}
            </div>
        </div>
        """
    
    return section_html

def format_email_content(releases, user_email, country_code=None):
    """Formats today's releases using an external HTML template with dynamic content"""
    try:
        with open(EMAIL_TEMPLATE_PATH, "r", encoding="utf-8") as template_file:
            email_html = template_file.read()
    except FileNotFoundError:
        return "<p>Error: Email template not found.</p>"

    # Generate dynamic sections with country code
    books_html = build_email_section(releases["books"], "📚 Books Releasing Today", "books", country_code)
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
