import requests
import pandas as pd
import time
from datetime import datetime
import pytz
from pymongo import MongoClient, UpdateOne

# === CONFIG ===
API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWRjM2UzYjRlODBlYmU1NGQzZmFhZTBhZDFhMTYxZiIsInN1YiI6IjY1NmNhNDNkNGE0YmY2MDEyMDI4MjY5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bhHq6dAvZe2B0gisqiSVGvWo_pkwUEDj3P-z5ed49Sg"
DISCOVER_URL = "https://api.themoviedb.org/3/discover/tv"
DETAILS_URL = "https://api.themoviedb.org/3/tv/{}?language=en-US"

MONGO_URI = "mongodb+srv://seifsami:beesknees@queuedupdbnew.lsrfn46.mongodb.net/?retryWrites=true&w=majority&appName=QueuedUpDBnew"
DATABASE_NAME = "QueuedUpDBnew"
COLLECTION_NAME = "tv_seasons"

HEADERS = {
    "accept": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

FIELDS_TO_UPDATE = [
    'name', 'release_date', 'genres', 'description', 'upcoming_season',
    'network_name', 'image', 'popularity', 'vote_average', 'vote_count',
    'first_air_date', 'original_language', 'spoken_languages', 'title'
]

# === TMDB FETCH FUNCTIONS ===

def fetch_shows_from_tmdb(threshold=10):
    page = 1
    all_shows = []
    backoff_time = 1

    while True:
        params = {
            "with_status": "0|2",
            "with_original_language": "en|ja|ko|es",
            "include_null_first_air_dates": "true",
            "sort_by": "popularity.desc",
            "include_adult": "false",
            "language": "en-US",
            "page": page
        }

        response = requests.get(DISCOVER_URL, headers=HEADERS, params=params)

        if response.status_code == 429:
            time.sleep(backoff_time)
            backoff_time *= 2
            continue

        if response.status_code != 200:
            break

        data = response.json()
        shows = data.get('results', [])

        if shows and shows[0].get('popularity', 0) < threshold:
            break

        all_shows.extend(shows)

        if page >= data.get('total_pages', 1):
            break

        page += 1
        time.sleep(0.5)

    return all_shows

def fetch_show_details(show_id):
    response = requests.get(DETAILS_URL.format(show_id), headers=HEADERS)
    return response.json() if response.status_code == 200 else None

def process_show_data(data):
    today = datetime.now().date()
    next_episode = data.get("next_episode_to_air")
    last_episode = data.get("last_episode_to_air")
    seasons = data.get("seasons", [])
    in_production = data.get("in_production", False)

    existing_season_numbers = [s['season_number'] for s in seasons if s['season_number'] > 0]
    max_season_number = max(existing_season_numbers, default=0)

    if not last_episode and next_episode:
        next_season_number = next_episode["season_number"]
        release_date = next_episode.get("air_date")
    elif next_episode and next_episode["episode_number"] == 1:
        next_season_number = next_episode["season_number"]
        release_date = next_episode.get("air_date")
    elif next_episode and next_episode["episode_number"] > 1:
        if last_episode and last_episode.get("episode_number") == 1:
            next_season_number = next_episode["season_number"]
            release_date = next_episode.get("air_date")
        else:
            return None
    else:
        latest_season = next((s for s in seasons if s['season_number'] == max_season_number), None)
        if latest_season and latest_season['air_date'] is None:
            next_season_number = max_season_number
            release_date = None
        elif in_production:
            next_season_number = 1 if max_season_number == 0 else max_season_number + 1
            release_date = None
        else:
            next_season_number = max_season_number + 1
            release_date = None
            for s in seasons:
                if s['season_number'] == next_season_number:
                    release_date = s.get("air_date")
                    break

    return {
        "tmdb_id": data.get("id"),
        "name": data.get("name"),
        "release_date": release_date,
        "genres": [g["name"] for g in data.get("genres", [])],
        "description": data.get("overview"),
        "upcoming_season": next_season_number,
        "network_name": data["networks"][0]["name"] if data.get("networks") else None,
        "image": f"https://image.tmdb.org/t/p/w500{data['poster_path']}" if data.get("poster_path") else None,
        "popularity": data.get("popularity"),
        "vote_average": data.get("vote_average"),
        "vote_count": data.get("vote_count"),
        "first_air_date": data.get("first_air_date"),
        "original_language": data.get("original_language"),
        "spoken_languages": [l["english_name"] for l in data.get("spoken_languages", [])]
    }

def parse_date_safe(date_str):
    if pd.isna(date_str) or not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=pytz.UTC)
    except Exception:
        return None

# === MAIN SYNC FUNCTION ===

def sync_to_mongodb(tv_shows_df):
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]

    tv_shows_df['title'] = tv_shows_df.apply(lambda x: f"{x['name']} Season {x['upcoming_season']}", axis=1)
    tv_shows_df['release_date'] = tv_shows_df['release_date'].apply(parse_date_safe)
    tv_shows_df['first_air_date'] = tv_shows_df['first_air_date'].apply(parse_date_safe)

    operations = []

    for _, row in tv_shows_df.iterrows():
        tmdb_id = row['tmdb_id']
        update_fields = {
            field: row[field]
            for field in FIELDS_TO_UPDATE
            if field in row and row[field] is not None and not (isinstance(row[field], float) and pd.isna(row[field]))
        }

        operations.append(
            UpdateOne(
                {'tmdb_id': tmdb_id},
                {'$set': update_fields},
                upsert=True
            )
        )

    if operations:
        result = collection.bulk_write(operations)
        print(f"✅ MongoDB Sync Complete:")
        print(f"• Matched: {result.matched_count}")
        print(f"• Modified: {result.modified_count}")
        print(f"• Upserted: {len(result.upserted_ids)}")
    else:
        print("⚠️ No updates to apply.")

# === MAIN SCRIPT ENTRY ===

def main():
    print("📡 Fetching TV shows from TMDB...")
    shows = fetch_shows_from_tmdb()

    detailed = []
    for show in shows:
        detail = fetch_show_details(show['id'])
        if detail:
            processed = process_show_data(detail)
            if processed:
                detailed.append(processed)

    df = pd.DataFrame(detailed)
    if df.empty:
        print("⚠️ No valid new TV shows found.")
        return

    print(f"📦 Fetched and processed {len(df)} TV shows. Syncing to MongoDB...")
    sync_to_mongodb(df)

if __name__ == "__main__":
    main()
