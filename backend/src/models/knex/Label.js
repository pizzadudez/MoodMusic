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
 * @returns {Promise<object>} Created labelObject
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
 * @param {number} labelId
 * @param {object} data
 */
exports.update = async (userId, labelId, data) => {
  if (data.type === 'subgenre') {
    // Validate parent type
    const validParent = await labelIsType(data.parent_id, 'genre');
    if (!validParent) {
      throw new Error('"parent_id" does not match a valid genre label.');
    }
  }
  await db('labels')
    .update({ ...data, updated_at: db.fn.now() })
    .where({ id: labelId, user_id: userId });

  return exports.get(userId, labelId);
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
  // TODO: validate labels belong to user?
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
  // Delete associations using temporary table
  await db.transaction(async tr => {
    await tr.raw(`CREATE TEMPORARY TABLE del (
      track_id varchar(255),
      label_id integer
    )`);
    await tr('del').bulkUpsert(data);
    await tr.raw(`DELETE FROM tracks_labels tl
      USING del d
      WHERE tl.track_id = d.track_id
        AND tl.label_id = d.label_id`);
    await tr.raw('DROP TABLE del');
  });
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
