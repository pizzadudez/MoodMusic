const TrackModel = require('../models/Track');

exports.addNewTracks = async () => {
  const tracks = await TrackModel.getAll()
  const hashMap = tracks.reduce((map, track) => {
    map[track.id] = true;
    return map;
  } , {});
  console.log(hashMap);
};