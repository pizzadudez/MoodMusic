const PlaylistModel = require('../_models/Playlist');

// Playlists map
exports.map = async () => {
  try {
    const playlists = await PlaylistModel.getAll();
    const map = playlists.reduce((map, pl) => {
      map[pl.id] = pl;
      return map;
    }, {});
    return map;
  } catch (err) {
    console.log(err);
    return err;
  }
};
