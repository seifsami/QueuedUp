from datetime import datetime

# Define a static schedule for featured releases (4 weeks of data)
FEATURED_RELEASES = {
    "books": [
        "promise-me-sunshine-books",
        "sunrise-on-the-reaping-a-hunger-games-novel-books",
        "great-big-beautiful-life-books",
        "say-you-ll-remember-me-books"
    ],
    "movies": [
        "bridget-jones-mad-about-the-boy-movies",
        "captain-america-brave-new-world-movies",
        "novocaine-movies",
        "snow-white-movies"
    ],
    "tv_seasons": [
        "invincible-season-3-tv_seasons",
        "the-white-lotus-season-3-tv_seasons",
        "reacher-season-3-tv_seasons",
        "daredevil-born-again-season-1-tv_seasons"
    ]
}

def get_current_week_index():
    """Calculate which week (0-3) we are in within the 4-week cycle."""
    start_date = datetime(2025, 2, 10)  # Change this to the launch date
    days_since_start = (datetime.now() - start_date).days
    return (days_since_start // 7) % 4  # Cycle through 4 weeks

def get_featured_slug(media_type):
    """Returns the slug for the current week's featured item for the given media type."""
    week_index = get_current_week_index()
    return FEATURED_RELEASES.get(media_type, [None])[week_index]
