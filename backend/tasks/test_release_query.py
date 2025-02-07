from release_query import get_today_releases

if __name__ == "__main__":
    releases = get_today_releases()
    print("Today's Releases:", releases)
