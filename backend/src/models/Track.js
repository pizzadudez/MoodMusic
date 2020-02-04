const db = require('./db').conn();

// Add new Tracks
exports.newTracks = async (tracks, liked = false) => {
  try {
    if (!tracks) return;
    const albums = tracks.reduce((obj, track) => {
      obj[track.album_id] = obj[track.album_id] || {
        id: track.album_id,
        name: track.album_name,
        images: track.album_images.map(obj => obj.url), // widest first
      };
      return obj;
    }, {});
    const albumsSql = `INSERT OR IGNORE INTO albums (
                       id, name, large, medium, small)
                       VALUES(?, ?, ?, ?, ?)`;
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        Object.values(albums).forEach(a => {
          const values = [a.id, a.name, ...a.images];
          db.run(albumsSql, values, err => {
            if (err) reject(err);
          });
        });
        db.run('COMMIT TRANSACTION', err => (err ? reject(err) : resolve()));
      });
    });
    const tracksSql = `INSERT OR IGNORE INTO tracks (
                       id, name, artist, album_id, added_at, liked)
                       VALUES(?, ?, ?, ?, ?, ?)`;
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        tracks.forEach(t => {
          const values = [
            t.id,
            t.name,
            t.artist,
            t.album_id,
            t.added_at,
            +liked,
          ];
          db.run(tracksSql, values, err => {
            if (err) reject(err);
          });
        });
        db.run('COMMIT TRANSACTION', err => (err ? reject(err) : resolve()));
      });
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
// List of all track objects (full)
exports.getAll = async () => {
  try {
    return new Promise((resolve, reject) => {
      const sql = `SELECT t.id, t.name, t.artist, t.added_at, t.rating, t.liked, 
                    a.id AS album,
                    GROUP_CONCAT(DISTINCT tp.playlist_id) AS playlist_ids,
                    GROUP_CONCAT(DISTINCT tl.label_id) as label_ids
                   FROM tracks t
                   LEFT JOIN tracks_playlists tp
                     ON t.id = tp.track_id
                   LEFT JOIN tracks_labels tl
                     ON t.id = tl.track_id
                   LEFT JOIN albums a
                     ON t.album_id = a.id
                   GROUP BY t.name
                   ORDER BY t.added_at DESC`;
      db.all(sql, (err, tracks) => {
        if (err) {
          reject(err);
        } else {
          db.all('SELECT * FROM albums', (err, albums) => {
            if (err) {
              reject(err);
            } else {
              const albumsById = albums.reduce(
                (obj, a) => ({
                  ...obj,
                  [a.id]: {
                    id: a.id,
                    name: a.name,
                    images: {
                      small: a.small,
                      medium: a.medium,
                      large: a.large,
                    },
                  },
                }),
                {}
              );
              const formatedTracks = tracks.map(t => ({
                ...t,
                album: albumsById[t.album],
                playlist_ids: t.playlist_ids ? t.playlist_ids.split(',') : [],
                label_ids: t.label_ids
                  ? t.label_ids.split(',').map(Number)
                  : [],
              }));
              const tracksById = formatedTracks.reduce(
                (obj, t) => ({
                  ...obj,
                  [t.id]: t,
                }),
                {}
              );
              resolve(tracksById);
            }
          });
        }
      });
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
exports.getAllOld = async () => {
  const sql = 'SELECT * FROM tracks';
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
    db.each(
      sql,
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          const promise = new Promise((res, rej) => {
            db.serialize(() => {
              db.get(sqlAlbum, row.album_id, (err, albumRow) => {
                if (err) reject(err);
                row.album = {
                  name: albumRow.name,
                  images: {
                    small: albumRow.small,
                    medium: albumRow.medium,
                    large: albumRow.large,
                  },
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
      },
      async (err, numRows) => {
        await Promise.all(promises);
        resolve(tracks);
      }
    );
  });
};
// List of Playlist's track ids
exports.getPlaylistTracks = id => {
  const sql = `SELECT track_id FROM tracks_playlists
               WHERE playlist_id=?`;
  return new Promise((resolve, reject) => {
    db.all(sql, [id], (err, rows) => {
      if (err) reject(Error(err));
      const list = rows.map(track => track.track_id);
      resolve(list);
    });
  });
};
// Sync Liked Songs
exports.syncLikedSongs = async hashMap => {
  try {
    const likedIds = await new Promise((resolve, reject) => {
      const sql = `SELECT id FROM tracks WHERE liked=1`;
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => row.id));
      });
    });
    const idsToUnlike = likedIds.filter(id => !hashMap[id]);
    await new Promise((resolve, reject) => {
      const unlikeSql = `UPDATE tracks SET liked=0
                         WHERE id=?`;
      const likeSql = `UPDATE tracks SET liked=1
                       WHERE id=? AND liked=0`;
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        // Unlike liked tracks not in hashMap
        idsToUnlike.forEach(id => {
          db.run(unlikeSql, [id], err => {
            if (err) reject(err);
          });
        });
        // Like unliked tracks from hashMap
        Object.keys(hashMap).forEach(id => {
          db.run(likeSql, [id], err => {
            if (err) reject(err);
          });
        });
        db.run('COMMIT TRANSACTION', err => (err ? reject(err) : resolve()));
      });
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

// Add track-playlist relationships
exports.addTracks = async playlistTracks => {
  if (!playlistTracks) return;
  const sql = `INSERT OR IGNORE INTO tracks_playlists (
               track_id, playlist_id, added_at, position)
               VALUES(?, ?, ?, ?)`;
  // Get last positions for playlists
  let lastPositions = {};
  const getLastPositions = playlistTracks.map(pl => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT position FROM tracks_playlists
                   WHERE playlist_id=?
                   ORDER BY position DESC`;
      db.get(sql, [pl.playlist_id], (err, row) => {
        if (err) reject(err);
        else if (row) lastPositions[pl.playlist_id] = row.position;
        else lastPositions[pl.playlist_id] = 0;
        resolve();
      });
    });
  });

  await Promise.all(getLastPositions);
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      playlistTracks.forEach(pl => {
        pl.tracks.forEach((track, idx) => {
          // TracksObj or just TrackIds
          const track_id = typeof track === 'object' ? track.id : track;
          const added_at =
            typeof track === 'object'
              ? track.added_at
              : new Date().toISOString();
          const values = [
            track_id,
            pl.playlist_id,
            added_at,
            lastPositions[pl.playlist_id] + idx + 1,
          ];
          db.run(sql, values, err => {
            if (err) reject(err);
          });
        });
      });
      db.run('COMMIT TRANSACTION', err => {
        const message = 'Successfully added tracks to playlists!';
        err ? reject(err) : resolve(message);
      });
    });
  });
};
// Remove track-playlist relationships
exports.removeTracks = playlistTracks => {
  if (!playlistTracks) return;
  const sql = `DELETE FROM tracks_playlists WHERE
               track_id=? AND playlist_id=?`;
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      playlistTracks.forEach(pl => {
        pl.tracks.forEach(track => {
          // TracksObj or just TrackIds
          const track_id = typeof track === 'object' ? track.id : track;
          const values = [track_id, pl.playlist_id];
          db.run(sql, values, err => {
            if (err) reject(err);
          });
        });
      });
      db.run('COMMIT TRANSACTION', err => {
        const message = 'Successfully removed tracks from playlists!';
        err ? reject(err) : resolve(message);
      });
    });
  });
};
// Update Track positions in playlist
exports.updatePositions = (id, tracks) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE tracks_playlists SET position=?
                 WHERE track_id=? AND playlist_id=?`;
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      tracks.forEach((track, idx) => {
        db.run(sql, [idx, track, id], err => {
          if (err) reject(err);
        });
      });
      db.run('COMMIT TRANSACTION', err => {
        err ? reject(err) : resolve();
      });
    });
  });
};

// Change a single track's rating field
exports.rateTrack = (id, rating) => {
  const sql = 'UPDATE tracks SET rating=? WHERE id=?';
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
