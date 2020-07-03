const db = require('../../../db/knex');

exports.createUser = (spotify_id, refresh_token) => {
  return db('users').insert({
    spotify_id,
    refresh_token,
  });
};

exports.updateUser;
