const db = require('../../../db/knex');

/**
 * Get user's labels as an array (or specific label by id).
 * @param {string} userId
 * @param {number=} labelId - (optional) get specific label byId.
 * @returns {Promise<object[] | object>}
 */
exports.get = async (userId, labelId) => {
  const { rows } = await db.raw(
    `SELECT l.id, l.type, l.name, l.color, l.verbose, 
    l.suffix, l.parent_id, l.created_at, l.updated_at, (
      SELECT ARRAY_AGG(id) FROM labels WHERE parent_id = l.id
    ) AS subgenre_ids, (
      SELECT COUNT(label_id) FROM tracks_labels tl
      WHERE tl.label_id = l.id
    ) AS track_count
    FROM labels l
    LEFT JOIN playlists p ON p.label_id = l.id
    WHERE l.user_id = ?` + (labelId ? ' AND l.id = ?' : ''),
    [userId, ...(labelId ? [labelId] : [])]
  );
  const labels = rows.map(
    ({ subgenre_ids, track_count, parent_id, ...rest }) => ({
      ...rest,
      track_count: Number(track_count),
      ...(parent_id && { genre_id: parent_id }),
      ...(rest.type === 'genre' && { subgenre_ids }),
    })
  );

  return labelId ? labels[0] : labels;
};
/**
 * Get user's labels as a byId object.
 * @param {string} userId
 * @returns {Promise<Object<string, object>>}
 */
exports.getAllById = async userId => {
  const labels = await exports.get(userId);
  return Object.fromEntries(labels.map(el => [el.id, el]));
};
/**
 * Create new label.
 * @param {string} userId
 * @param {object} data
 * @returns {Promise<object>} Created label
 */
exports.create = async (userId, data) => {
  if (data.type === 'subgenre') {
    // Validate parent type
    const validParent = await labelIsType(data.parent_id, 'genre');
    if (!validParent) {
      throw new Error('"parent_id" does not match a valid genre label.');
    }
  }
  const ids = await db('labels')
    .insert({ ...data, user_id: userId })
    .returning('id');

  return exports.get(userId, ids[0]);
};
/**
 * Update existing label.
 * @param {string} userId
 * @param {number} id - labelId
 * @param {object} data
 * @returns {Promise<object>} Updated label
 */
exports.update = async (userId, id, data) => {
  if (data.type === 'subgenre') {
    // Validate parent type
    const validParent = await labelIsType(data.parent_id, 'genre');
    if (!validParent) {
      throw new Error('"parent_id" does not match a valid genre label.');
    }
  }
  await db('labels')
    .update({ ...data, updated_at: db.fn.now() })
    .where({ id, user_id: userId });

  return exports.get(userId, id);
};
/**
 * Delete label byId.
 * @param {string} userId
 * @param {number} labelId
 */
exports.delete = async (userId, labelId) => {
  await db('labels').where({ id: labelId, user_id: userId }).del();
};

/**
 * Handle adding Label-Track associations.
 * @param {LabelTracks[]} list
 */
exports.addLabels = async list => {
  const data = list
    .map(({ label_id, track_ids }) =>
      track_ids.map(track_id => ({
        label_id,
        track_id,
      }))
    )
    .flat();
  await db('tracks_labels').bulkUpsert(data);
};
/**
 * Handle removing Label-Track associations.
 * @param {LabelTracks[]} list
 */
exports.removeLabels = async list => {
  const data = list
    .map(({ label_id, track_ids }) =>
      track_ids.map(track_id => ({
        label_id,
        track_id,
      }))
    )
    .flat();
  await db('tracks_labels').bulkDelete(data, Object.keys(data[0]));
};
/**
 * Sync 'label' playlists by matching tracks-playlists with tracks-labels.
 * @param {string} playlistId
 * @param {number} labelId
 * @param {string[]} trackIds
 */
exports.syncPlaylistLabels = async (playlistId, labelId, trackIds) => {
  // Get tracks_ids associated with label but not playlist.
  const trackIdsToRemove = await db('tracks_labels as tl')
    .leftJoin('tracks_playlists as tp', 'tp.track_id', 'tl.track_id')
    .where('tl.label_id', labelId)
    .whereRaw('tp.playlist_id IS DISTINCT FROM ?', [playlistId])
    .pluck('tl.track_id');
  // Remove extra tracks
  if (trackIds.length) {
    await exports.removeLabels([
      { label_id: labelId, track_ids: trackIdsToRemove },
    ]);
  }
  // Upsert all label playlist's tracks.
  await exports.addLabels([{ label_id: labelId, track_ids: trackIds }]);
};
/**
 * Get all trackIds associated with a label.
 * @param {number} labelId
 * @returns {Promise<string[]>}
 */
exports.getTrackIds = async labelId => {
  const rows = db('tracks_labels')
    .pluck('track_id')
    .where('label_id', labelId)
    .orderBy('added_at', 'desc');
  return rows;
};

// Helpers
/**
 * Check label against type.
 * @param {string} id - labelId
 * @param {string} type - labelType
 * @returns {Promise<boolean>}
 */
const labelIsType = async (id, type) => {
  const rows = await db('labels').pluck('type').where('id', id);
  return rows[0] === type;
};
