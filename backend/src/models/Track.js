const db = require('./db').conn();

// Add tracks from spotify playlists
exports.insertTracks = (tracks, playlistId) => {
  if (!tracks) return;
  const sqlTracks = `INSERT INTO tracks (
                     id, name, artist, album)
                     VALUES(?, ?, ?, ?)`;
  const sqlTracksPlaylists = `INSERT INTO tracks_playlists (
                              track_id, playlist_id, added_at)
                              VALUES(?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      tracks.forEach(t => {
        db.run(sqlTracks, [t.id, t.name, t.artist, t.album], err => {
          if (err && err.code !== 'SQLITE_CONSTRAINT') { reject(err); }
        });
        db.run(sqlTracksPlaylists, [t.id, playlistId, t.added_at], err => {
          if (err && err.code !== 'SQLITE_CONSTRAINT') { reject(err); }
        });
      });
      db.run("COMMIT TRANSACTION", err => {
        if (err) {
          reject(err);
        } else {
          resolve('success')
        }
      });
    });
  });
};
exports.hashMap = () => {
  const sql = `SELECT id FROM tracks`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const hashMap = rows.reduce((map, row) => {
          map[row.id] = true;
          return map;
        }, {});
        resolve(hashMap);
      }
    });
  });
};
// Add new Tracks
exports.newTracks = tracks => {
  if (!tracks) return;
  const sql = `INSERT INTO tracks (
               id, name, artist, album)
               VALUES(?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      tracks.forEach(t => {
        const values = [t.id, t.name, t.artist, t.album];
        db.run(sql, values, err => {
          if (err) { reject(err); }
        });
      });
      db.run('COMMIT TRANSACTION', err => {
        if (err) {
          reject(err);
        } else {
          resolve('success');
        }
      });
    });
  });
};
// Add track-playlist relationships
exports.addTracks = list => {
  if(!list) return;
  const added_at = new Date;
  const sql = `INSERT INTO tracks_playlists (
               track_id, playlist_id, added_at)
               VALUES(?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      list.forEach(el => {
        const playlist_id = el.playlist_id;
        el.track_ids.forEach(track => {
          // Accept both track_ids and trackObj
          const track_id = typeof(track) === 'Object' ? track.id : track;
          const values = [track_id, playlist_id, added_at];
          db.run(sql, values, err => {
            if (err) { reject(err); }
          });
        });
      })
      db.run("COMMIT TRANSACTION", err => {
        if (err) {
          reject(err);
        } else {
          resolve('Successfully added tracks to playlists!');
        }
      })
    });
  });
};
// Remove track-playlist relationships
exports.removeTracks = list => {
  if(!list) return;
  const added_at = new Date;
  const sql = `DELETE FROM tracks_playlists WHERE
               track_id=? AND playlist_id=?`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      list.forEach(el => {
        const playlist_id = el.playlist_id;
        el.track_ids.forEach(track_id => {
          const values = [track_id, playlist_id];
          db.run(sql, values, err => {
            if (err) { reject(err); }
          });
        });
      })
      db.run("COMMIT TRANSACTION", err => {
        if (err) {
          reject(err);
        } else {
          resolve('Successfully removed tracks from playlists!');
        }
      })
    });
  });
};