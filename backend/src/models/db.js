const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite3', err => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database connection established');
  }
});
// Import this into models
exports.conn = () => { 
  return db; 
};
// Init database on server start
exports.init = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
            user_id TEXT UNIQUE,
            access_token TEXT,
            refresh_token TEXT,
            expires INTEGER)`);
    db.run(`CREATE TABLE IF NOT EXISTS playlists (
            id TEXT UNIQUE,
            name TEXT,
            snapshot_id TEXT,
            changes INTEGER,
            tracking INTEGER,
            PRIMARY KEY (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS tracks (
            id TEXT UNIQUE,
            name TEXT,
            artist TEXT,
            album TEXT,
            PRIMARY KEY (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS tracks_playlists (
            track_id TEXT,
            playlist_id TEXT,
            added_at TEXT,
            PRIMARY KEY (track_id, playlist_id),
            FOREIGN KEY (track_id) REFERENCES tracks (id),
            FOREIGN KEY (playlist_id) REFERENCES playlists (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS genres (
            id TEXT,
            name TEXT,
            PRIMARY KEY (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS subgenres (
            id TEXT,
            name TEXT,
            genre_id TEXT,
            PRIMARY KEY (id),
            FOREIGN KEY (genre_id) REFERENCES genres (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS moods (
            id TEXT,
            name TEXT,
            PRIMARY KEY (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS tracks_genres (
            track_id TEXT,
            genre_id TEXT,
            PRIMARY KEY (track_id, genre_id),
            FOREIGN KEY (track_id) REFERENCES tracks (id),
            FOREIGN KEY (genre_id) REFERENCES genres (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS tracks_subgenres (
            track_id TEXT,
            subgenre_id TEXT,
            PRIMARY KEY (track_id, subgenre_id),
            FOREIGN KEY (track_id) REFERENCES tracks (id),
            FOREIGN KEY (subgenre_id) REFERENCES subgenres (id))`);               
    db.run(`CREATE TABLE IF NOT EXISTS tracks_moods (
            track_id TEXT,
            mood_id TEXT,
            PRIMARY KEY (track_id, mood_id),
            FOREIGN KEY (track_id) REFERENCES tracks (id),
            FOREIGN KEY (mood_id) REFERENCES moods (id))`);
  });
};