class Movie:
    def __init__(self, _id, adult, backdrop_path, genre_ids, movie_id, original_language, original_title, description, popularity, image, release_date, title, video, vote_average, vote_count, franchise_id, franchise_name, franchise_poster, genres, director):
        self._id = _id
        self.adult = adult
        self.backdrop_path = backdrop_path
        self.genre_ids = genre_ids
        self.id = movie_id
        self.original_language = original_language
        self.original_title = original_title
        self.description = description
        self.popularity = popularity
        self.image = image
        self.release_date = release_date
        self.title = title
        self.video = video
        self.vote_average = vote_average
        self.vote_count = vote_count
        self.franchise_id = franchise_id
        self.franchise_name = franchise_name
        self.franchise_poster = franchise_poster
        self.genres = genres
        self.director = director

class TVSeason:
    def __init__(self, _id, backdrop_path, first_air_date, genre_ids, tmdb_id, name, origin_country, original_language, original_name, description, popularity, image, release_date, title, video, vote_average, upcoming_season, network_name, vote_count, collection_id, collection_name, collection_poster, genres):
        self._id = _id
        self.backdrop_path = backdrop_path
        self.first_air_date = first_air_date
        self.genre_ids = genre_ids
        self.tmdb_id = tmdb_id
        self.name = name
        self.origin_country = origin_country
        self.original_language = original_language
        self.original_name = original_name
        self.description = description
        self.popularity = popularity
        self.image = image
        self.release_date = release_date
        self.title = title
        self.video = video
        self.vote_average = vote_average
        self.upcoming_season = upcoming_season
        self.network_name = network_name
        self.vote_count = vote_count
        self.collection_id = collection_id
        self.collection_name = collection_name
        self.collection_poster = collection_poster
        self.genres = genres

class Book:
    def __init__(self, _id, title, backup_image, date_published, synopsis, author, edition, isbn, book_id, author_lf, additional_authors, isbn13, my_rating, average_rating, publisher, binding, number_of_pages, year_published, original_publication_year, date_read, date_added, bookshelves, bookshelves_with_positions, exclusive_shelf, my_review, spoiler, private_notes, read_count, owned_copies, series, book_number_in_series, release_date, description, image):
        self._id = _id
        self.title = title
        self.backup_image = backup_image
        self.date_published = date_published
        self.synopsis = synopsis
        self.author = author
        self.edition = edition
        self.isbn = isbn
        self.book_id = book_id
        self.author_lf = author_lf
        self.additional_authors = additional_authors
        self.isbn13 = isbn13
        self.my_rating = my_rating
        self.average_rating = average_rating
        self.publisher = publisher
        self.binding = binding
        self.number_of_pages = number_of_pages
        self.year_published = year_published
        self.original_publication_year = original_publication_year
        self.date_read = date_read
        self.date_added = date_added
        self.bookshelves = bookshelves
        self.bookshelves_with_positions = bookshelves_with_positions
        self.exclusive_shelf = exclusive_shelf
        self.my_review = my_review
        self.spoiler = spoiler
        self.private_notes = private_notes
        self.read_count = read_count
        self.owned_copies = owned_copies
        self.series = series
        self.book_number_in_series = book_number_in_series
        self.release_date = release_date
        self.description = description
        self.image = image

class User:
    def __init__(self, _id, first_name, last_name, email, username, phone_number, notification_preferences, firebase_id):
        self._id = _id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.username = username
        self.phone_number = phone_number
        self.notification_preferences = notification_preferences  # List of preferences like ['email', 'phone']
        self.firebase_id = firebase_id
       

class Notification:
    def __init__(self, user_id, book_id, message, type, status, created_at, scheduled_send_time, sent_at=None):
        self.user_id = user_id  # ID of the user to whom the notification is sent
        self.book_id = book_id  # ID of the related book
        self.message = message  # Notification message content
        self.type = type  # Type of notification (e.g., 'pre-order-available', 'release-notice')
        self.status = status  # Status of the notification (e.g., 'pending', 'sent')
        self.created_at = created_at  # Timestamp when the notification was created
        self.scheduled_send_time = scheduled_send_time  # Scheduled time for sending the notification
        self.sent_at = sent_at  # Actual time when the notification was sent (initially None)


class UserWatchlist:
    def __init__(self, user_id, item_id, media_type):
        self.user_id = user_id  # ID of the user who added the item to their watchlist
        self.item_id = item_id  # ID of the media item (book, movie, TV show) on the watchlist
        self.media_type = media_type  # Type of media (e.g., 'book', 'movie', 'tv')

    # Additional methods can be added as needed, such as saving to or removing from the database
