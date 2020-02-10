const request = require('request-promise-native');
const UserModel = require('../_models/User');
const TrackModel = require('../_models/Track');

// Sync Liked Songs
exports.syncLikedSongs = async () => {
  const tracks = await getLikedSongs();
  const hashMap = tracks.reduce(
    (obj, t) => ({
      ...obj,
      [t.id]: true,
    }),
    {}
  );
  await TrackModel.newTracks(tracks, true);
  await TrackModel.syncLikedSongs(hashMap);
};

const getLikedSongs = async () => {
  const token = (await UserModel.userData()).access_token;
  const response = await request.get({
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: { Authorization: 'Bearer ' + token },
    json: true,
  });
  const totalTracks = response.total;

  const requests = [];
  for (let offset = 0; offset <= totalTracks / 50; offset++) {
    const req = async () => {
      const response = await request.get({
        url:
          'https://api.spotify.com/v1/me/tracks?limit=50&offset=' + offset * 50,
        headers: { Authorization: 'Bearer ' + token },
        json: true,
      });
      return response.items.map(obj => ({
        id: obj.track.id,
        name: obj.track.name,
        artist: obj.track.artists[0].name,
        album_id: obj.track.album.id,
        added_at: obj.added_at,
        album_name: obj.track.album.name,
        album_images: obj.track.album.images,
      }));
    };
    requests.push(req());
  }
  return (await Promise.all(requests)).flat(Infinity);
};
