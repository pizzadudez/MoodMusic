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
    db.get('PRAGMA foreign_keys = ON');
    db.run(`CREATE TABLE IF NOT EXISTS users (
            user_id TEXT UNIQUE,
            access_token TEXT,
            refresh_token TEXT,
            expires INTEGER)`);
    db.run(`CREATE TABLE IF NOT EXISTS playlists (
            id TEXT,
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
    db.run(`CREATE TABLE IF NOT EXISTS labels (
            id INTEGER NOT NULL,
            type TEXT NOT NULL,
            name TEXT NOT NULL UNIQUE,
            color TEXT,
            parent_id INTEGER,
            PRIMARY KEY (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS tracks_playlists (
            track_id TEXT NOT NULL,
            playlist_id TEXT NOT NULL,
            added_at TEXT,
            PRIMARY KEY (track_id, playlist_id),
            FOREIGN KEY (track_id) REFERENCES tracks (id),
            FOREIGN KEY (playlist_id) REFERENCES playlists (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS tracks_labels (
            track_id TEXT NOT NULL,
            label_id INTEGER NOT NULL,
            added_at TEXT,
            PRIMARY KEY (track_id, label_id),
            FOREIGN KEY (track_id) REFERENCES tracks (id),
            FOREIGN KEY (label_id) REFERENCES labels (id))`);
  });
};