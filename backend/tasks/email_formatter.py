def format_email_content(releases):
    """Formats today's releases into an HTML email structure with brand colors."""

    email_body = """
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background: #FAFAFA; color: #383838;">
        <h2 style="color: #2E8B57;">📢 Your QueuedUp Releases for Today!</h2>
    """

    # Books Section
    if releases["books"]:
        email_body += '<h2 style="color: #2E8B57;">📚 Books Releasing Today</h2>'
        for book in releases["books"]:
            amazon_link = f"https://www.amazon.com/s?k={book['title'].replace(' ', '+')}&tag=queuedup0f-20"
            email_body += f"""
                <div style="display: flex; align-items: center; margin-bottom: 15px; background: #A8D5BA; padding: 10px; border-radius: 8px;">
                    <img src="{book['image']}" width="120" height="auto" style="border-radius: 5px; margin-right: 10px;">
                    <div>
                        <h3 style="color: #383838;">{book['title']}</h3>
                        <p style="color: #256B45;">📅 Available Now</p>
                        <a href="{amazon_link}" style="background: #FF7043; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none;">
                            🛒 Buy on Amazon
                        </a>
                    </div>
                </div>
            """

    # Movies Section
    if releases["movies"]:
        email_body += '<h2 style="color: #2E8B57;">🎬 Movies Releasing Today</h2>'
        for movie in releases["movies"]:
            email_body += f"""
                <div style="display: flex; align-items: center; margin-bottom: 15px; background: #A8D5BA; padding: 10px; border-radius: 8px;">
                    <img src="{movie['image']}" width="120" height="auto" style="border-radius: 5px; margin-right: 10px;">
                    <div>
                        <h3 style="color: #383838;">{movie['title']}</h3>
                        <p style="color: #256B45;">📅 Out Today!</p>
                    </div>
                </div>
            """

    # TV Shows Section
    if releases["tv_seasons"]:
        email_body += '<h2 style="color: #2E8B57;">📺 TV Shows Releasing Today</h2>'
        for tv_show in releases["tv_seasons"]:
            email_body += f"""
                <div style="display: flex; align-items: center; margin-bottom: 15px; background: #A8D5BA; padding: 10px; border-radius: 8px;">
                    <img src="{tv_show['image']}" width="120" height="auto" style="border-radius: 5px; margin-right: 10px;">
                    <div>
                        <h3 style="color: #383838;">{tv_show['title']}</h3>
                        <p style="color: #256B45;">📅 Out Today!</p>
                    </div>
                </div>
            """

    # Trending & Watchlist CTA
    email_body += """
        <h3 style="color: #2E8B57;">🔥 What's Trending on QueuedUp?</h3>
        <p>See what’s new & add more to your watchlist!</p>
        <a href="https://www.queuedup.co/#/homepage" style="background: #007BFF; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none;">
            Browse Trending Releases
        </a>
        <hr>
        <p style="color: #256B45;">💡 Want QueuedUp to be even better?</p>
        <p>💬 Reply to this email & tell us what features you’d love to see!</p>
    </body>
    </html>
    """
    
    return email_body
