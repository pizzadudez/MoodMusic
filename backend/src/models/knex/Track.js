const db = require('../../../db/knex');

/**
 * Get user's tracks as an array.
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
exports.getAll = async userId => {
  // Group playlists and labels by track_id and aggregate as array
  const trackLabels = await db('tracks_labels')
    .leftJoin('labels', 'labels.id', 'tracks_labels.label_id')
    .select(
      'track_id',
      db.raw('ARRAY_AGG(label_id ORDER BY tracks_labels.added_at) labels')
    )
    .groupBy('track_id')
    .where('user_id', userId)
    .then(rows =>
      Object.fromEntries(rows.map(row => [row.track_id, row.labels]))
    );
  const trackPlaylists = await db('tracks_playlists')
    .leftJoin('playlists', 'playlists.id', 'tracks_playlists.playlist_id')
    .select(
      'track_id',
      db.raw(
        'ARRAY_AGG(playlist_id ORDER BY tracks_playlists.added_at) playlists'
      )
    )
    .groupBy('track_id')
    .where('user_id', userId)
    .then(rows =>
      Object.fromEntries(rows.map(row => [row.track_id, row.playlists]))
    );
  // Get user's tracks; add label and playlist id fields
  const rows = await db('tracks_users')
    .leftJoin('tracks', 'tracks.id', 'tracks_users.track_id')
    .leftJoin('albums', 'albums.id', 'tracks.album_id')
    .select(
      'tracks.id',
      'tracks.name',
      'artist',
      'added_at',
      'rating',
      'liked',
      'albums.id as album_id',
      'albums.name as album_name',
      'albums.small',
      'albums.medium',
      'albums.large'
    )
    .orderBy('added_at', 'desc')
    .where('user_id', userId);
  const tracks = rows.map(
    ({ album_id, album_name, small, medium, large, ...rest }) => ({
      ...rest,
      playlist_ids: trackPlaylists[rest.id] || [],
      label_ids: trackLabels[rest.id] || [],
      album: {
        id: album_id,
        name: album_name,
        images: {
          small,
          medium,
          large,
        },
      },
    })
  );

  return tracks;
};
/**
 * Get user's tracks as a byId object.
 * @param {string} userId
 * @returns {Promise<Object<string,object>>}
 */
exports.getAllById = async userId => {
  const tracks = await exports.getAll(userId);
  return Object.fromEntries(tracks.map(el => [el.id, el]));
};
/**
 * Update user's track.
 * @param {string} userId
 * @param {string} trackId
 * @param {object} data
 * @param {boolean=} data.liked
 * @param {number=} data.rating
 */
exports.update = async (userId, trackId, data) => {
  const { liked, rating } = data;
  await db('tracks_users')
    .update({ liked, rating })
    .where({ track_id: trackId, user_id: userId });
};

/**
 * Insert new Tracks, Albums and Track-User associations
 * @param {string} userId
 * @param {ParsedTrack[]} trackList - List of parsed Spotify TrackObjects.
 * @param {boolean=} sync
 * @param {boolean=} liked - Set true if the list of tracks is from Liked Songs.
 */
exports.addTracks = async (userId, trackList, sync = false, liked = false) => {
  // TODO: sync liked tracks
  if (trackList.length < 1) return;
  const albums = trackList.map(track => track.album);
  const tracks = trackList.map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artist,
    album_id: track.album_id,
  }));
  const userTracks = trackList.map(track => ({
    track_id: track.id,
    user_id: userId,
    liked,
    added_at: track.added_at,
  }));

  await db.transaction(async tr => {
    await tr('albums').bulkUpsert(albums);
    await tr('tracks').bulkUpsert(tracks);
    await tr('tracks_users').bulkUpsert(userTracks);
  });
};
