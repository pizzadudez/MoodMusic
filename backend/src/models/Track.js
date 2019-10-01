const db = require('./db').conn();

// Add new Tracks
exports.newTracks = tracks => {
  if (!tracks) return;
  const sql = `INSERT OR IGNORE INTO tracks (
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
// List of all track objects (full)
exports.getAll = async () => {
  const sql = "SELECT * FROM tracks";
  const sqlLabels = `SELECT tl.label_id FROM tracks_labels tl
                     LEFT JOIN tracks t ON t.id = tl.track_id
                     WHERE tl.track_id=?`;
  const sqlPlaylists = `SELECT tp.playlist_id FROM tracks_playlists tp
                        LEFT JOIN tracks t ON t.id = tp.track_id
                        WHERE tp.track_id=?`;
  let tracks = [];
  let promises = [];
  return new Promise((resolve, reject) => {
    db.each(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        const promise = new Promise((res, rej) => {
          db.serialize(() => {
            db.all(sqlPlaylists, row.id, (err, rows) => {
              row.playlist_ids = rows.map(row => row.playlist_id);
            });
            db.all(sqlLabels, row.id, (err, rows) => {
              row.label_ids = rows.map(row => row.label_id);
              tracks.push(row);
              res();
            });
          });
        });
        promises.push(promise);
      }
    }, async (err, numRows) => {
      await Promise.all(promises);
      resolve(tracks);
    });
  });
};

// Add track-playlist relationships
exports.addTracks = list => {
  if(!list) return;
  const added_at = new Date;
  const sql = `INSERT OR IGNORE INTO tracks_playlists (
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