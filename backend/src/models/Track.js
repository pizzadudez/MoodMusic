const db = require('../../db').conn();

exports.getAll = async (byId = false) => {
  const trackSQL = `SELECT id, name, artist, added_at, 
    rating, liked, album_id as album
    FROM tracks ORDER BY added_at DESC`;
  const playlistSQL = `SELECT DISTINCT track_id, 
    group_concat(playlist_id) OVER (
      PARTITION BY track_id 
      ORDER BY added_at ASC 
      ROWS BETWEEN UNBOUNDED PRECEDING 
      AND UNBOUNDED FOLLOWING
    ) as playlists
    FROM tracks_playlists`;
  const labelSQL = `SELECT DISTINCT track_id, 
    group_concat(label_id) OVER (
      PARTITION BY track_id 
      ORDER BY added_at ASC 
      ROWS BETWEEN UNBOUNDED PRECEDING 
      AND UNBOUNDED FOLLOWING
    ) as labels
    FROM tracks_labels`;
  const playlistOrderSql = 'SELECT id, track_count FROM playlists';
  const labelOrderSql = `SELECT label_id, count(label_id) as track_count
    FROM tracks_labels GROUP BY label_id`;

  const tracks = new Promise((resolve, reject) => {
    db.all(trackSQL, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(rows);
      }
    });
  });
  const albums = new Promise((resolve, reject) => {
    db.all('SELECT * FROM albums', (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        const albumsById = Object.fromEntries(
          rows.map(row => {
            const album = {
              id: row.id,
              name: row.name,
              images: {
                small: row.small,
                medium: row.medium,
                large: row.large,
              },
            };
            return [row.id, album];
          })
        );
        resolve(albumsById);
      }
    });
  });
  const playlists = new Promise((resolve, reject) => {
    db.all(playlistOrderSql, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        const trackCount = Object.fromEntries(
          rows.map(row => [row.id, row.track_count])
        );
        db.all(playlistSQL, (err, rows) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            const trackPlaylists = Object.fromEntries(
              rows.map(row => [
                row.track_id,
                row.playlists
                  .split(',')
                  .sort((a, b) => trackCount[b] - trackCount[a]),
              ])
            );
            resolve(trackPlaylists);
          }
        });
      }
    });
  });
  const labels = new Promise((resolve, reject) => {
    db.all(labelOrderSql, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        const trackCount = Object.fromEntries(
          rows.map(row => [row.label_id, row.track_count])
        );
        db.all(labelSQL, (err, rows) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            const trackLabels = Object.fromEntries(
              rows.map(row => [
                row.track_id,
                row.labels
                  .split(',')
                  .map(Number)
                  .sort((a, b) => trackCount[b] - trackCount[a]),
              ])
            );
            resolve(trackLabels);
          }
        });
      }
    });
  });
  const [
    trackList,
    albumsById,
    trackPlaylists,
    trackLabels,
  ] = await Promise.all([tracks, albums, playlists, labels]);
  const complexTracks = trackList.map(t => ({
    ...t,
    album: albumsById[t.album],
    playlist_ids: trackPlaylists[t.id] || [],
    label_ids: trackLabels[t.id] || [],
  }));

  return byId
    ? Object.fromEntries(complexTracks.map(t => [t.id, t]))
    : complexTracks;
};
exports.getAllById = () => {
  return exports.getAll(true);
};
exports.getAllIds = (hashMap = false) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id FROM tracks', (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        hashMap
          ? resolve(Object.fromEntries(rows.map(row => [row.id, true])))
          : resolve(rows.map(row => row.id));
      }
    });
  });
};

exports.addTracks = async (list, liked = false, sync = false) => {
  const albumSql = `INSERT OR IGNORE INTO albums
    (id, name, large, medium, small)
    VALUES(?, ?, ?, ?, ?)`;
  const trackSql = `INSERT OR IGNORE INTO tracks
    (id, name, artist, album_id, added_at, liked)
    VALUES(?, ?, ?, ?, ?, ?)`;

  const hashMap = await exports.getAllIds(true);
  const newTracks = list.filter(track => !hashMap[track.id]);
  if (!newTracks.length) {
    if (liked && sync) {
      syncLikedTracks(list);
    }
    return;
  }

  const albumsById = Object.fromEntries(
    newTracks.map(track => [track.album.id, track.album])
  );
  const newAlbums = Object.values(albumsById);
  await new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      newAlbums.forEach(a => {
        db.run(albumSql, [a.id, a.name, ...a.images], err => {
          if (err) reject(new Error(err.message));
        });
      });
      db.run('COMMIT TRANSACTION', err => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve();
        }
      });
    });
  });

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      newTracks.forEach(t => {
        const values = [t.id, t.name, t.artist, t.album_id, t.added_at, +liked];
        db.run(trackSql, values, err => {
          if (err) reject(new Error(err.message));
        });
      });
      db.run('COMMIT TRANSACTION', err => {
        if (err) {
          reject(new Error(err.message));
        } else if (liked && sync) {
          resolve(syncLikedTracks(list));
        } else {
          resolve();
        }
      });
    });
  });
};
exports.update = (id, changes) => {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(changes)
      .map(key => key + '=?')
      .join(', ');
    const values = Object.values(changes);
    const sql = 'UPDATE tracks SET ' + fields + ' WHERE id=?';
    db.run(sql, [...values, id], err => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve();
      }
    });
  });
};

// Helpers
const syncLikedTracks = async tracks => {
  const hashMap = Object.fromEntries(tracks.map(track => [track.id, true]));
  const likedIds = await new Promise((resolve, reject) => {
    db.all('SELECT id FROM tracks WHERE liked=1', (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(rows.map(row => row.id));
      }
    });
  });
  const idsToUnlike = likedIds.filter(id => !hashMap[id]);

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      idsToUnlike.forEach(id => {
        db.run('UPDATE tracks SET liked=0 WHERE id=?', [id], err => {
          if (err) reject(new Error(err.message));
        });
      });
      Object.keys(hashMap).forEach(id => {
        db.run('UPDATE tracks set liked=1 WHERE id=?', [id], err => {
          if (err) reject(new Error(err.message));
        });
      });
      db.run('COMMIT TRANSACTION', err => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve();
        }
      });
    });
  });
};
