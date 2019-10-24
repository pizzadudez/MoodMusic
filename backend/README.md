## Api Endpoint Definitions

# Playlists

## Fetch all playlist objects [array]

- *url:* **/playlists**
- *method:* **GET**

## Update Playlist Data

- *url:* **/playlists/check**
- *method:* **GET**

## Create Playlist

- *url:* **/playlists**
- *method:* **POST**
- *body:*
  - **name** - required

## Delete Playlist (unfollow)

- *url:* **/playlists/{playlist_id}**
- *method:* **DELETE**

## Update Playlist (settings)

- *url*: **/playlists/{playlist_id}**
- *method:* **PATCH**
- *body:*
  - **mood_playlist** - optional | 0/1
  - **genre_id** - optional | integer (label.id)
  - **tracking** - optional | 0/1

## Reorder Playlist tracks

- *url:* **/playlists/{playlist_id}/reorder**
- *method:* POST
- *body:*
  - **tracks** - required | array (track.id)

