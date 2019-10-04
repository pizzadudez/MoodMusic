const db = require('./db').conn();

// Add new Tracks
exports.newTracks = tracks => {
  if (!tracks) return;
  const sql = `INSERT OR IGNORE INTO tracks (
               id, name, artist, album_id, added_at)
               VALUES(?, ?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      tracks.forEach(t => {
        const values = [t.id, t.name, t.artist, t.album_id, t.added_at];
        db.run(sql, values, err => {
          if (err) reject(err);
        });
      });
      db.run('COMMIT TRANSACTION', err => err ? reject(err) : resolve());
    });
  });
};
// List of all track objects (full)
exports.getAll = async () => {
  const sql = "SELECT * FROM tracks";
  const sqlAlbum = `SELECT * FROM albums WHERE id=?`;
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
            db.get(sqlAlbum, row.album_id, (err, albumRow) => {
              if (err) reject(err);
              row.album = {
                'name': albumRow.name,
                'images': {
                  'small': albumRow.small,
                  'medium': albumRow.medium,
                  'large': albumRow.large
                }
              };
            });
            db.all(sqlPlaylists, row.id, (err, rows) => {
              if (err) reject(err);
              row.playlist_ids = rows.map(row => row.playlist_id);
            });
            db.all(sqlLabels, row.id, (err, rows) => {
              if (err) reject(err);
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
exports.addTracks = playlistTracks => {
  if(!playlistTracks) return;
  const sql = `INSERT OR IGNORE INTO tracks_playlists (
               track_id, playlist_id, added_at, position)
               VALUES(?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      playlistTracks.forEach(async pl => {
        // Get Last Track position
        let lastPosition = await new Promise((resolve, reject) => {
          const sql = `SELECT position FROM tracks_playlists
                       WHERE playlist_id=?
                       ORDER BY position DESC`;
          db.get(sql, [pl.playlist_id], (err, row) => {
            err ? resolve(0) : row ? resolve(row.position) : resolve(0);
          });
        });
        // Add new Tracks
        db.serialize(() => {
          pl.tracks.forEach((track, idx) => {
            const values = [track.id, pl.playlist_id, track.added_at, lastPosition+idx];
            db.run(sql, values, err => reject(err));
          });
        });
      });
      db.run("COMMIT TRANSACTION", err => {
        const message = 'Successfully added tracks to playlists!';
        err ? reject(err) : resolve(message);
      });
    });
  });
};
// Remove track-playlist relationships
exports.removeTracks = playlistTracks => {
  if(!playlistTracks) return;
  const sql = `DELETE FROM tracks_playlists WHERE
               track_id=? AND playlist_id=?`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      playlistTracks.forEach(pl => {
        pl.tracks.forEach(track => {
          // TracksObj or just TrackIds
          const track_id = typeof(track) === 'Object' ? track.id : track;
          const values = [track_id, pl.playlist_id];
          db.run(sql, values, err => {
            if (err) reject(err);
          });
        });
      });
      db.run("COMMIT TRANSACTION", err => {
        const message = 'Successfully removed tracks from playlists!';
        err ? reject(err) : resolve(message);
      });
    });
  });
};

// Change a single track's rating field
exports.rateTrack = (id, rating) => {
  const sql = "UPDATE tracks SET rating=? WHERE id=?";
  return new Promise((resolve, reject) => {
    db.run(sql, [rating, id], function(err) {
      if (err) {
        reject(err);
      } else if (!this.changes) {
        reject(`There is no track with id: ${id}.`);
      } else {
        resolve(`Successfully set rating for track id: ${id}!`);
      }
    });
  });
};

// Track positions map for a specific playlist id
// exports.TrackPositions = playlistId => {
//   const sql = `SELECT track_id, position FROM tracks_playlists
//                WHERE playlist_id=?
//                ORDER BY position, added_at`;
//   return new Promise((resolve, reject) => {});
// };