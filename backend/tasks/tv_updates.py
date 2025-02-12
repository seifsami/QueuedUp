import pymongo
import requests
from datetime import datetime
import pytz

# MongoDB Connection
MONGO_URI = "mongodb+srv://seifsami:beesknees@queuedupdbnew.lsrfn46.mongodb.net/?retryWrites=true&w=majority&appName=QueuedUpDBnew"
client = pymongo.MongoClient(MONGO_URI)
db = client["QueuedUpDBnew"]
tv_seasons_collection = db["tv_seasons"]

# TMDB API Configuration
API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWRjM2UzYjRlODBlYmU1NGQzZmFhZTBhZDFhMTYxZiIsIm5iZiI6MTcwMTYxODc0OS45MjMsInN1YiI6IjY1NmNhNDNkNGE0YmY2MDEyMDI4MjY5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bhHq6dAvZe2B0gisqiSVGvWo_pkwUEDj3P-z5ed49Sg"
headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

# Function to fetch show details from TMDB
def fetch_show_details_from_tmdb(tmdb_id):
    url = f"https://api.themoviedb.org/3/tv/{tmdb_id}?language=en-US"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch data for TMDB ID: {tmdb_id}")
        return None

# Function to safely convert date strings to UTC datetime
def convert_to_utc(date_str):
    if not date_str:
        return None
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    return pytz.UTC.localize(date_obj)

# Function to check and update release dates in MongoDB
def update_release_dates():
    shows_in_db = list(tv_seasons_collection.find({}))

    updates_made = 0  # Track how many updates were made

    for show in shows_in_db:
        tmdb_id = show.get('tmdb_id')
        stored_release_date = show.get('release_date')

        tmdb_data = fetch_show_details_from_tmdb(tmdb_id)
        if not tmdb_data:
            continue

        # Extract the updated release date from TMDB
        next_episode = tmdb_data.get("next_episode_to_air")
        if next_episode and next_episode.get("air_date"):
            tmdb_release_date = convert_to_utc(next_episode["air_date"])
        else:
            tmdb_release_date = None

        # Compare and update if the release date has changed
        if tmdb_release_date != stored_release_date:
            tv_seasons_collection.update_one(
                {"tmdb_id": tmdb_id},
                {"$set": {"release_date": tmdb_release_date}}
            )
            updates_made += 1
            print(f"Updated release date for: {show.get('name')} (TMDB ID: {tmdb_id})")

    print(f"\nTotal updates made: {updates_made}")

# Run the script
if __name__ == "__main__":
    update_release_dates()
