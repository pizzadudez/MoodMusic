const LabelModel = require('../_models/Label');
const TrackModel = require('../_models/Track');

// Label map
exports.map = async () => {
  try {
    const labels = await LabelModel.getAll();
    const map = labels.reduce((map, label) => {
      map[label.id] = label;
      return map;
    }, {});
    return map;
  } catch (err) {
    console.log(err);
    return err;
  }
};
//
exports.playlistGenre = async (id, genreId) => {
  const tracks = await TrackModel.getPlaylistTracks(id);
  const tracksLabels = tracks.map(track => ({
    track_id: track,
    label_ids: [genreId],
  }));
  await LabelModel.addLabels(tracksLabels);
};
