const db = require('./db').conn();

exports.getAll = async () => {
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
    db.all(playlistSQL, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        const trackPlaylists = Object.fromEntries(
          rows.map(row => [row.track_id, row.playlists.split(',')])
        );
        resolve(trackPlaylists);
      }
    });
  });
  const labels = new Promise((resolve, reject) => {
    db.all(labelSQL, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        const trackLabels = Object.fromEntries(
          rows.map(row => [row.track_id, row.labels.split(',').map(Number)])
        );
        resolve(trackLabels);
      }
    });
  });
  const [
    trackList,
    albumsById,
    trackPlaylists,
    trackLabels,
  ] = await Promise.all([tracks, albums, playlists, labels]);
  const tracksById = Object.fromEntries(
    trackList.map(t => {
      const track = {
        ...t,
        album: albumsById[t.album],
        playlist_ids: trackPlaylists[t.id] || [],
        label_ids: trackLabels[t.id] || [],
      };
      return [t.id, track];
    })
  );
  return tracksById;
};
