const LabelModel = require('../models/knex/Label');
const PlaylistModel = require('../models/knex/Playlist');
const PlaylistsService = require('./playlists');

exports.delete = async (userObj, id) => {
  /**
   * - delete label
   * - ????
   */
};

// TODO: hook new models and services
exports.delete1 = async id => {
  await LabelModel.delete(id);
  const playlists = await PlaylistModel.getAll();

  const requests = playlists
    .filter(p => p.type === 'label' && !p.label_id)
    .map(p => PlaylistsService.delete(p.id));

  await Promise.all(requests);
};
