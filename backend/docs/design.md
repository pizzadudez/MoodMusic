## Fix Later:

- Buffer() deprecation warning 
- Eliminate useless track inserts (use hash maps to see what to not insert)

## Ideas / Questions:

- What determines if a song is new and requires attention?
- How do I handle songs with multiple artists?
- add using the same post request (make sure to specify what type of label it is)

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

