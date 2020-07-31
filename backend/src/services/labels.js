const LabelModel = require('../models/Label');
const PlaylistsService = require('./playlists');

/**
 * Handle deleting label and associated playlist.
 * @param {UserObj} userObj
 * @param {number} id - labelId
 */
exports.delete = async (userObj, id) => {
  const playlistId = await LabelModel.delete(userObj.userId, id);
  if (playlistId) await PlaylistsService.delete(userObj, playlistId);
};
