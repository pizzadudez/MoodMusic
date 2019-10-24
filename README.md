## Usage

# Authorization and initial setup
1. Authorize the app
2. No data => Get user's playlists
3. First time playlist configuration:
   1. Every newly retrieved playlist is untracked by default
   2. Track playlists that will contain the songs you wish to categorize
   3. Check for Playlist Updates to retrieve songs from tracked playlists

# Manage Playlists
1. Playlist types:
   1. **Containers**
   2. **MoodPlaylist**
2. Operations:
   - Create/Delete
   - Change playlist settings (tracking, type, default genre)
   - Reorder a playlists' tracks

# Manage Labels
- Create new Labels
- Update (name, color, parent_genre)
- Color Picker

# Filter Tracks
1. By playlists
2. By labels
   - track must contain any *include* label
   - track must not contain any *exclude* labels
2. By search
   - track name, artist or album must contain the searched string

# Track Operations
- add/remove labels/playlists
  - On individual track:
    - menu appears relative to track
    - directly click on highlighted buttons to remove attributes and the reverse
    - 2 buttons: 
      - Done: locally updates the track and stores the changes for later bulk submit
      - Submit: locally update and also send post request to update immediately
  - On track selection:
    - on this menu you select the attributes and click either add/remove
    - upon add/remove click track attributes are locally updated
    - submit changes remotely immediately or after some more operations
- Menu to change star rating (individual track or selection)
- Sort Filtered tracks by: date_added, rating (default date_added from backend)


# Features that might make it
- Liked songs added and treated as special container playlist
- Play button or fully integrated playback
- Query/filter based playlists that can be auto updated with fitting tracks
- Mp3 file tag injection
- Changes rollback (store snapshots of changes)

