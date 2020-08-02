const PlaylistModel = require('../models/Playlist');
const PlaylistsService = require('../services/playlists');

exports.getAll = async (req, res) => {
  try {
    const playlistsById = await PlaylistModel.getAllById(req.user.userId);
    res.status(200).json(playlistsById);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal server error.');
  }
};
exports.addPlaylists = async (req, res) => {
  try {
    await PlaylistsService.addTracks(req.user, req.body);
    res.status(201).send('Tracks added to playlists.');
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal server error.');
  }
};
exports.removePlaylists = async (req, res) => {
  try {
    await PlaylistsService.removeTracks(req.user, req.body);
    res.status(201).send('Tracks removed from playlists.');
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal server error.');
  }
};

exports.create = async (req, res) => {
  try {
    const playlist = await PlaylistsService.create(req.user, req.body);
    res.status(200).json(playlist);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
};
exports.update = async (req, res) => {
  try {
    const playlist = await PlaylistsService.update(
      req.user,
      req.params.id,
      req.body
    );
    res.status(200).json(playlist);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
};
exports.delete = async (req, res) => {
  try {
    const playlist = await PlaylistsService.delete(req.user, req.params.id);
    res.status(200).json(playlist);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
};
exports.restore = async (req, res) => {
  try {
    const playlist = await PlaylistsService.restore(req.user, req.params.id);
    res.status(200).json(playlist);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
};

exports.syncTracks = async (req, res) => {
  try {
    const playlist = await PlaylistsService.syncTracks(req.user, req.params.id);
    res.status(200).json(playlist);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
};
exports.revertTracks = async (req, res) => {
  try {
    const playlist = await PlaylistsService.revertTracks(
      req.user,
      req.params.id
    );
    res.status(200).send(playlist);
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
};
// TODO: adapt from this old service (v1)
exports.reorderTracks = async (req, res) => {
  /*
  exports.updatePositions = async (id, tracks) => {
    try {
      const token = (await UserModel.data()).access_token;
      const currTrackList = await getPlaylistTracks(id, token, true);
      if (currTrackList.tracks.length != tracks.length) {
        throw new Error('Malformed tracklist. Unequal lengths');
      }
      const hashMap = currTrackList.tracks.reduce((map, trackObj) => {
        map[trackObj.id] = true;
        return map;
      }, {});
      tracks.forEach(track => {
        if (!hashMap[track]) throw new Error('Malformed tracklist. Id mismatch');
      });
      // Validation done, request complete replacement of tracks
      await new Promise(async (resolve, reject) => {
        let uris = tracks.map(track => 'spotify:track:' + track);
        // 100 tracks limit per request
        while (uris.length) {
          const uriSegment = uris.splice(0, 100);
          const options = {
            url: 'https://api.spotify.com/v1/playlists/' + id + '/tracks',
            headers: { Authorization: 'Bearer ' + token },
            body: { uris: uriSegment },
            json: true,
          };
          await new Promise((resolve, reject) => {
            request.put(options, (err, res, body) => {
              const error = err || res.statusCode >= 400 ? body : null;
              error ? reject(error) : resolve();
            });
          }).catch(err => reject(err));
        }
        resolve();
      });
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  };
  */
};
