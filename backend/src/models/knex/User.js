const db = require('../../../db/knex');

exports.register = (spotify_id, refresh_token) => {
  return db
    .raw(
      `? ON CONFLICT (spotify_id)
      DO UPDATE SET
      refresh_token = EXCLUDED.refresh_token,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;`,
      [db('users').insert({ spotify_id, refresh_token })]
    )
    .catch(err => {
      throw new Error(err.message);
    });
};
exports.update = (spotify_id, data) => {
  return db('users').where({ spotify_id }).update(data);
};

exports.getRefreshToken = spotify_id => {
  return db('users')
    .where({ spotify_id })
    .select('refresh_token')
    .then(row => row[0].refresh_token)
    .catch(err => {
      throw new Error(err.message);
    });
};

exports.updateUser;
