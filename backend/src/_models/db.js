const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite3', err => {
  err ? console.log(err) : console.log('Database connected');
});
// Import this into models
exports.conn = () => {
  return db;
};
// Init database on server start
exports.init = () => {
  db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON');
    db.run(`CREATE TABLE IF NOT EXISTS users (
            user_id TEXT UNIQUE,
            access_token TEXT,
            refresh_token TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS playlists (
            id TEXT NOT NULL PRIMARY KEY,
            name TEXT,
            snapshot_id TEXT,
            genre_id INTEGER DEFAULT NULL,
            mood_playlist INTEGER DEFAULT 0,
            changes INTEGER DEFAULT 1,
            tracking INTEGER DEFAULT 0,
            FOREIGN KEY (genre_id) REFERENCES labels (id) ON DELETE SET NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS tracks (
            id TEXT NOT NULL PRIMARY KEY,
            name TEXT,
            artist TEXT,
            album_id TEXT,
            added_at TEXT,
            rating INTEGER DEFAULT 0,
            liked INTEGER DEFAULT 0,
            FOREIGN KEY (album_id) REFERENCES albums (id))`);
    db.run(`CREATE TABLE IF NOT EXISTS albums (
            id TEXT NOT NULL PRIMARY KEY,
            name TEXT,
            small TEXT,
            medium TEXT,
            large TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS labels (
            id INTEGER NOT NULL PRIMARY KEY,
            type TEXT NOT NULL,
            name TEXT NOT NULL UNIQUE,
            verbose TEXT DEFAULT NULL,
            suffix TEXT DEFAULT NULL,
            color TEXT,
            parent_id INTEGER DEFAULT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS tracks_playlists (
            track_id TEXT NOT NULL,
            playlist_id TEXT NOT NULL,
            added_at TEXT,
            position INTEGER DEFAULT NULL,
            PRIMARY KEY (track_id, playlist_id),
            FOREIGN KEY (track_id) REFERENCES tracks (id) ON DELETE CASCADE,
            FOREIGN KEY (playlist_id) REFERENCES playlists (id) ON DELETE CASCADE)`);
    db.run(`CREATE TABLE IF NOT EXISTS tracks_labels (
            track_id TEXT NOT NULL,
            label_id INTEGER NOT NULL,
            added_at TEXT,
            PRIMARY KEY (track_id, label_id),
            FOREIGN KEY (track_id) REFERENCES tracks (id) ON DELETE CASCADE,
            FOREIGN KEY (label_id) REFERENCES labels (id) ON DELETE CASCADE)`);
  });
};