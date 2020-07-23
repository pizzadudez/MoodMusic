const LabelModel = require('../models/Label');
const PlaylistModel = require('../models/Playlist');
const PlaylistsService = require('./playlists');

// TODO: hook new models and services
exports.delete = async id => {
  await LabelModel.delete(id);
  const playlists = await PlaylistModel.getAll();

  const requests = playlists
    .filter(p => p.type === 'label' && !p.label_id)
    .map(p => PlaylistsService.delete(p.id));

  await Promise.all(requests);
};
