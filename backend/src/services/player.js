const request = require('request');
const UserModel = require('../models/User');

// Play track on available devices
exports.playTrack = async id => {
  try {
    const userData = await UserModel.userData();
    const options = {
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: { 'Authorization' : 'Bearer ' + userData.access_token },
      body: { 'uris': ["spotify:track:" + id] },
      json: true,
    };
    await new Promise((resolve, reject) => {
      request.put(options, (err, res, body) => {
        const error = err || (res.statusCode >= 400 && body);
        error ? reject(error) : resolve();
      })
    });
  } catch (err) {
    console.log(err);
    return err;
  }
}