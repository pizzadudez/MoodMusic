const db = require('../../../db/knex');

exports.registerUser = (spotify_id, refresh_token) => {
  return db('users')
    .insert({
      spotify_id,
      refresh_token,
    })
    .catch(err => {
      throw new Error(err.message);
    });
  //TODO: handle user update
};

exports.getRefreshToken = spotify_id => {
  return db('users')
    .where({ spotify_id })
    .select('refresh_toke')
    .then(row => row[0].refresh_token)
    .catch(err => {
      throw new Error(err.message);
    });
};

exports.updateUser;
