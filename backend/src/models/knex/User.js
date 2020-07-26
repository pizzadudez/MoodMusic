const db = require('../../../db/knex');

/**
 * Create new user or update refresh_token for existing entry.
 * @param {string} id - userId
 * @param {string} refresh_token - Refresh token provided by Spotify
 */
exports.register = async (id, refresh_token) => {
  await db.raw(
    `? ON CONFLICT (id) DO UPDATE SET
      refresh_token = EXCLUDED.refresh_token,
      updated_at = NOW()`,
    [db('users').insert({ id, refresh_token })]
  );
};
/**
 * Update user record.
 * @param {string} id - userId
 * @param {object} data
 * @param {string=} data.refresh_token
 * @param {boolean=} data.refreshed_at
 * @param {boolean=} data.synced_at
 */
exports.update = async (id, data) => {
  const { refreshed_at, synced_at, refresh_token } = data;
  await db('users')
    .update({
      refresh_token,
      ...(refreshed_at && { refreshed_at: db.fn.now() }),
      ...(synced_at && { synced_at: db.fn.now() }),
      updated_at: db.fn.now(),
    })
    .where({ id });
};
/**
 * Retrieve UserData
 * @param {string} id - userId
 * @returns {Promise<UserData>}
 */
exports.data = async id => {
  const rows = await db('users')
    .select('refresh_token', 'refreshed_at', 'synced_at')
    .where({ id });
  return rows[0];
};

/**
 * Check if all labelIds belong to the user.
 * @param {string} userId
 * @param {number[]} labelIds
 * @returns {Promise<boolean>}
 */
exports.checkLabels = async (userId, labelIds) => {
  const ids = await db('labels').pluck('id').where('user_id', userId);
  const userLabels = Object.fromEntries(ids.map(id => [id, true]));

  return labelIds.every(id => userLabels[id]);
};
/**
 * Check if all playlistIds belong to the user.
 * @param {string} userId
 * @param {number[]} playlistIds
 * @returns {Promise<boolean>}
 */
exports.checkPlaylists = async (userId, playlistIds) => {
  const ids = await db('playlists').pluck('id').where('user_id', userId);
  const userPlaylists = Object.fromEntries(ids.map(id => [id, true]));

  return playlistIds.every(id => userPlaylists[id]);
};
