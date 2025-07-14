import requests
import pandas as pd
import time
from pymongo import MongoClient
from datetime import datetime

# === CONFIG ===
API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWRjM2UzYjRlODBlYmU1NGQzZmFhZTBhZDFhMTYxZiIsIm5iZiI6MTcwMTYxODc0OS45MjMsInN1YiI6IjY1NmNhNDNkNGE0YmY2MDEyMDI4MjY5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bhHq6dAvZe2B0gisqiSVGvWo_pkwUEDj3P-z5ed49Sg"
headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}
MONGO_URI = "mongodb+srv://seifsami:beesknees@queuedupdbnew.lsrfn46.mongodb.net/?retryWrites=true&w=majority&appName=QueuedUpDBnew"
DATABASE_NAME = "QueuedUpDBnew"
COLLECTION_NAME = "tv_seasons"
# === TMDB Fetch ===
def fetch_shows_from_tmdb():
    url = "https://api.themoviedb.org/3/discover/tv"
    all_shows = []
    page = 1

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

        res = requests.get(url, headers=headers, params=params)
        if res.status_code != 200:
            print(f"❌ Failed to fetch page {page} — status: {res.status_code}")
            break

        results = res.json().get("results", [])
        if not results or results[0].get("popularity", 0) < 10:
            break

        all_shows.extend(results)
        print(f"📄 Page {page} — fetched {len(results)} shows")

        if page >= res.json().get("total_pages", 1):
            break

        page += 1
        time.sleep(0.5)

    return all_shows

# === Processing Individual Show ===
def process_tv_show(show_id):
    url = f"https://api.themoviedb.org/3/tv/{show_id}?language=en-US"
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        return None

    d = r.json()
    next_episode = d.get("next_episode_to_air")
    last_episode = d.get("last_episode_to_air")
    in_production = d.get("in_production", False)
    seasons = d.get("seasons", [])
    max_season = max([s["season_number"] for s in seasons if s["season_number"] > 0], default=0)

    if not last_episode and next_episode:
        season = next_episode["season_number"]
        release = next_episode.get("air_date")
    elif next_episode and next_episode["episode_number"] == 1:
        season = next_episode["season_number"]
        release = next_episode.get("air_date")
    elif next_episode and next_episode["episode_number"] > 1:
        if last_episode and last_episode.get("episode_number") == 1:
            season = next_episode["season_number"]
            release = next_episode.get("air_date")
        else:
            return None
    else:
        latest = next((s for s in seasons if s["season_number"] == max_season), None)
        if latest and not latest.get("air_date"):
            season = max_season
            release = None
        elif in_production:
            season = 1 if max_season == 0 else max_season + 1
            release = None
        else:
            season = max_season + 1
            release = None
            for s in seasons:
                if s["season_number"] == season:
                    release = s.get("air_date")
                    break

    return {
        "tmdb_id": d.get("id"),
        "name": d.get("name"),
        "release_date": release,
        "genres": [g["name"] for g in d.get("genres", [])],
        "overview": d.get("overview"),
        "upcoming_season": season,
        "network_name": d["networks"][0]["name"] if d.get("networks") else None,
        "image": f"https://image.tmdb.org/t/p/w500{d['poster_path']}" if d.get("poster_path") else None,
        "popularity": d.get("popularity"),
        "vote_average": d.get("vote_average"),
        "vote_count": d.get("vote_count"),
        "first_air_date": d.get("first_air_date"),
        "original_language": d.get("original_language"),
        "spoken_languages": [lang["english_name"] for lang in d.get("spoken_languages", [])]
    }

def parse_date_safe(date_val):
    if pd.isna(date_val):
        return None
    try:
        dt = pd.to_datetime(date_val, errors='coerce')
        if pd.isna(dt):
            return None
        return dt.replace(tzinfo=None)  # Remove UTC info
    except Exception:
        return None

def sync_to_mongodb(tv_df):
    client = MongoClient(MONGO_URI)
    collection = client[DATABASE_NAME][COLLECTION_NAME]

    tv_df['title'] = tv_df.apply(lambda x: f"{x['name']} Season {x['upcoming_season']}", axis=1)
    tv_df['release_date'] = tv_df['release_date'].apply(parse_date_safe)
    tv_df['first_air_date'] = tv_df['first_air_date'].apply(parse_date_safe)

    updated_count = 0
    for _, row in tv_df.iterrows():
        doc = {}
        for field in row.index:
            val = row[field]

            # Skip NaN unless it's a list/dict
            if isinstance(val, (list, dict)):
                pass
            elif pd.isna(val):
                continue

            # Convert pandas Timestamp to native datetime and remove tz
            if isinstance(val, pd.Timestamp):
                val = val.to_pydatetime().replace(tzinfo=None)

            doc[field] = val

        result = collection.update_one(
            {"tmdb_id": row["tmdb_id"]},
            {"$set": doc},
            upsert=True
        )

        if result.matched_count and result.modified_count:
            print(f"🔁 Updated: {row['title']} — release_date: {row.get('release_date')}")
            updated_count += 1
        elif result.upserted_id:
            print(f"✨ Inserted: {row['title']} — release_date: {row.get('release_date')}")
            updated_count += 1

    print(f"\n✅ Total updated or inserted: {updated_count}")

# === Main Execution ===
def main():
    """Main function to run TV updates - called by blueprint"""
    print("📡 Fetching TV shows from TMDB...")
    all_shows = fetch_shows_from_tmdb()
    print(f"\n📦 Fetched {len(all_shows)} shows")

    detailed = []
    for i, show in enumerate(all_shows):
        result = process_tv_show(show["id"])
        if result:
            detailed.append(result)
        if (i + 1) % 20 == 0:
            print(f"🔄 Processed {i + 1} shows")
        time.sleep(0.25)

    df = pd.DataFrame(detailed)
    print(f"\n📦 Processed {len(df)} valid shows")

    if df.empty:
        print("⚠️ No valid new TV shows found.")
        return

    sync_to_mongodb(df)

if __name__ == "__main__":
    main()