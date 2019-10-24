## Fix Later:

- [x] Buffer() deprecation warning 
- [ ] Eliminate useless track inserts (use hash maps to see what to not insert)
- [x] Handle playlists/tracks with over 100 songs (and playlists when over 20)
- [x] Handle songs removed from playlists
  - [x] Solution: delete all tracks_playlists relations if tracks no longer in playlist
  - [ ] Keep songs without playlsits (they will have their own 'pseudo playlist')
- [x] When Checking multiple playlists we get sql fk constraint fail

## Ideas / Questions:

- What determines if a song is new and requires attention?
- [x] How do I handle songs with multiple artists? A: only first artist
- add all labels using the same post request (make sure to specify what type of label it is)
- [x] Give playlists a genre id: this way we automatically set the genre for a song
- [x] Store album images along side an Album table (will be useful for mp3 tagging too)
- Store last playlist check somewhere
- [x] Think of Song ordering
- [x] Think of Song ratings and up/downvoting songs
- [x] Playlist default genres field (fk)

## Steps:

- list all data I can retrieve
- decide which is important and dismiss the rest
- make sure to note interesting things the api provides (might be useful later)
- compose the flow of the app
- design the database schema
- create api routes to:
  - populate db with data from spotify
  - add my app's data to the db
  - create/update custom playlists
- models: 
  - auth:
  - playlists
  - tracks

### API available data:

- **Structure of paging objects**
  - items: list of objects
  - limit: # of objects in one page
  - next: url to the next page
  - total: total # of objects
- **Playlists**
  - use query parameters to target specific data
  - playlist track object fields: added_at
- **Tracks**
  - name
  - album
  - artists
  - id

### API operations:

- Replace whole playlist, overwriting old data
- Create new playlist
- Add/Remove tracks from playlist
- Reorder tracks in playlist
- Change playlist name
- Spotify song analysis (lots of interesting parameters)

## Frontend Requirements (API endpoints):

- get list of track objects with all info (playlist, gen, sgen, mood)

- get list of playlist objects

- get list of label objects (sepparate for each type)

  

- create local MoodPlaylist (with optional list of tracks)

- post track/s to MoodPlaylist

- delete track/s from MoodPlaylist

- Publish / Update spotify MoodPlaylist

- Create label

- Delete label (and track relations with label)

- Add / Remove label from track/s

# API endpoints:

- /labels
  - GET
  - POST
- /labels/add
  - POST
- /labels/remove
  - POST
- /label/:id
  - GET
  - PATCH
  - DELETE

- /playlists
  - GET
  - POST
- /playlists/check
  - GET: check for playlist changes; response is same as /playlists
- /playlist/id
  - GET
  - PATCH
  - DELETE

- /tracks
  - GET
- /tracks/add
  - POST
- /tracks/remove
  - POST
- /tracks/check
  - GET

