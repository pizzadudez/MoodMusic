const db = require('../../../db/knex');

exports.register = (id, refresh_token) => {
  return db.raw(
    `? ON CONFLICT (id) DO UPDATE SET
      refresh_token = EXCLUDED.refresh_token,
      updated_at = CURRENT_TIMESTAMP`,
    [db('users').insert({ id, refresh_token })]
  );
};
exports.update = (id, data) => {
  return db('users').where({ id }).update(data);
};

exports.getRefreshToken = id => {
  return db('users')
    .where({ id })
    .select('refresh_token')
    .then(row => row[0].refresh_token);
};

exports.updateUser;
