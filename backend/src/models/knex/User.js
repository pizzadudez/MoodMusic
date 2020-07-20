const db = require('../../../db/knex');
const knex = require('../../../db/knex');

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
 * Update user
 * @param {string} id - userId
 * @param {object} data
 * @param {string=} data.refreshed_at
 * @param {string=} data.synced_at
 * @param {string=} data.refresh_token
 */
exports.update = async (id, data) => {
  await db('users')
    .where({ id })
    .update({ ...data, updated_at: knex.fn.now() });
};
/**
 * Retrieve userData
 * @param {string} id - userId
 * @returns {Promise<userData>}
 */
exports.data = async id => {
  const rows = await db('users')
    .select('refresh_token', 'refreshed_at', 'synced_at')
    .where({ id });
  return rows[0];
};
