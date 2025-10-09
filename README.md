# MVP Playlist Server

## Overview
MVP Playlist Server powers the companion Chrome extension for curating music video playlists. It exposes a RESTful API backed by PostgreSQL that lets each authenticated user save music videos, group them into playlists, and retrieve embeddable playback links. The service is written in Express, uses Babel for modern JavaScript support, and centralises cross-cutting concerns such as logging, error handling, and CORS configuration so the extension can focus on its user experience.

### How it works
* **Authentication by bearer token** – Users register and log in via `/users/register` and `/users/login`. Passwords are salted and hashed with SHA-256 before storage, and the API returns a hashed user identifier token that must be sent in the `Authorization` header on subsequent requests.
* **PostgreSQL persistence** – Four tables (`users`, `songs`, `playlists`, `playlist_songs`) capture accounts, saved videos, playlist definitions, and playlist membership. Foreign keys and cascading deletes keep related data in sync.
* **Video normalisation** – Submitted video URLs are normalised to provider identifiers so that the server can produce lightweight records and build embed URLs for playback.
* **Express middleware** – Common middleware (CORS, morgan logging, cookie parsing, JSON/body parsing) is configured in `src/app.js`, and unhandled errors are converted into structured JSON responses.

## Key Features
### User management
* Register new users with duplicate checks on usernames and emails, validated email format, and hashed password storage.
* Log in existing users and receive a reusable bearer token derived from the user ID and shared salt.
* Retrieve the authenticated user's profile metadata (`user_id`, `username`, `email`, `created_at`).

### Song library
* Create, read, update, and delete songs tied to the authenticated user via `/users/user/songs` endpoints.
* Prevent duplicate submissions by comparing normalised video IDs and flagging invalid or unsupported URLs.
* Track song metadata such as title, artist, provider domain, and insertion timestamps for sorted listing.

### Playlist organisation
* Maintain named playlists per user, with uniqueness checks to avoid duplicate names.
* Add or remove multiple songs within a playlist through batch SQL inserts and targeted deletions.
* Query playlist contents with joined song metadata, enabling the client to display ready-to-play queues.

### Robust infrastructure defaults
* Graceful shutdown hooks close the HTTP server and database pool on process termination signals.
* Central error handler returns consistent JSON structures and status codes for missing routes and server issues.

## Getting Started
### Prerequisites
* Node.js 10.15.x (or newer compatible version) and npm ≥ 6.4.0.
* PostgreSQL instance accessible to the application.

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a PostgreSQL database and run the schema migrations:
   ```bash
   psql -d <your_database_name> -f src/config/tables.sql
   ```
3. (Optional) Load example data for local testing:
   ```bash
   psql -d <your_database_name> -f src/config/seed.sql
   ```
4. Provide the required environment variables. You can use a `.env` file or your shell environment with the following keys:
   ```bash
   export DATABASE=<your_database_name>
   export USER=<db_username>
   export HOST=<db_host>
   export PORT=<db_port>
   export SALT=<shared_secret_for_hashing>
   # If using a full connection string instead, define DATABASE_URL.
   ```

### Running the server
* **Development mode (with live reload and source maps):**
  ```bash
  npm run dev
  ```
* **Production build:**
  ```bash
  npm run build
  npm start
  ```
The server listens on `PORT` (default `8080`) and logs the URL once it starts.

### Testing
Run the Jest test suite:
```bash
npm test
```

## API Summary
All authenticated endpoints expect the hashed user token in the `Authorization` header.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/users/register` | Create a user account and receive an auth token. |
| POST | `/users/login` | Validate credentials and receive an auth token. |
| GET | `/users/user` | Fetch the current user's profile details. |
| GET | `/users/user/songs` | List songs saved by the user (most recent first). |
| GET | `/users/user/song?id=<song_id>` | Retrieve a single song with embeddable URL. |
| POST | `/users/user/songs` | Add a song (normalises YouTube/Dailymotion URLs). |
| PUT | `/users/user/songs` | Update song metadata (and optionally URL). |
| DELETE | `/users/user/songs` | Remove a song by ID. |
| GET | `/users/user/playlists` | List the user's playlists. |
| GET | `/users/user/playlist?id=<playlist_id>` | Retrieve a playlist definition. |
| POST | `/users/user/playlist` | Create a new playlist. |
| PUT | `/users/user/playlist` | Rename an existing playlist. |
| DELETE | `/users/user/playlist` | Delete a playlist. |
| GET | `/users/user/playlistsongs?id=<playlist_id>` | Fetch songs within a playlist. |
| GET | `/users/user/playlistsong?id=<playlist_songs_id>` | Fetch a playlist entry with song metadata. |
| POST | `/users/user/playlistsong` | Add one or more songs to a playlist. |
| DELETE | `/users/user/playlistsong` | Remove a song from a playlist. |

## Credits
This server was originally scaffolded from vmasto's `express-babel` boilerplate.
