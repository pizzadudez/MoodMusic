// Used to test different services or model methods

const router = require('express').Router();
const LabelModel1 = require('../models/Label');
const LabelModel = require('../models/knex/Label');
const TrackModel1 = require('../models/Track');
const TrackModel = require('../models/knex/Track');
const PlaylistModel1 = require('../models/Playlist');
const PlaylistModel = require('../models/knex/Playlist');
const TracksService = require('../services/tracks');
const PlaylistsService = require('../services/playlists');
const UserModel = require('../models/knex/User');
const db = require('../../db/knex');

router.get('/', async (req, res, next) => {
  try {
    let response;
    console.time('getTest');
    // =======================TEST CODE HERE=======================
    // const data = [
    //   { id: 17, color: '#123123', verbose: 'test2' },
    //   { id: 19, color: '#123123', verbose: 'test2' },
    //   { id: 22, color: '#123123', verbose: 'test2' },
    // ];
    // const customUpdateSet = `"color" = "tmp"."color",
    //   "verbose" = "labels"."verbose" || "tmp"."verbose"`;
    // await db('labels').bulkUpdate(data, undefined, customUpdateSet);

    // await PlaylistsService.update(req.user.userId, '0UgkVNe1k74eWQwaudS8Ob', {
    //   description: '123',
    // });

    // const qb = db.raw(`SELECT tl.track_id FROM tracks_labels tl
    // LEFT JOIN tracks_playlists tp ON tl.track_id = tp.track_id
    // WHERE tl.label_id = 1
    // AND tp.playlist_id IS DISTINCT FROM '0UgkVNe1k74eWQwaudS8Ob'`);
    // const { rows } = await qb;
    // response = rows;

    // const qb = db('tracks_labels as tl')
    //   .pluck('tl.track_id')
    //   .leftJoin('tracks_playlists as tp', 'tp.track_id', 'tl.track_id')
    //   .where('tl.label_id', 7)
    //   .whereRaw('tp.playlist_id IS DISTINCT FROM ?', [
    //     '3u3C3gwuWhxIUPEsYZ2MAV',
    //   ]);
    // // console.log(qb.toString());
    // response = await qb;

    // await PlaylistsService.addTracks(req.user, [
    //   {
    //     playlist_id: '56aUoIhjOHD3Fy0kv7I3Qt',
    //     track_ids: ['005JfkAhvs05PiQLUb2Iuf', '0nkDm27DGppCSk8dnGtvPa'],
    //   },
    // ]);

    // await PlaylistsService.removeSpecificSpotifyTracks(req.user, {
    //   playlist_id: '56aUoIhjOHD3Fy0kv7I3Qt',
    //   tracks: [{ id: '005JfkAhvs05PiQLUb2Iuf', position: 2 }],
    // });

    // const v = {
    //   a: () => {
    //     const trackMap = {};
    //     const duplicates = [];
    //     tracks.forEach((track, idx) => {
    //       if (trackMap[track.id]) {
    //         duplicates.push({ id: track.id, position: idx });
    //       }
    //       trackMap[track.id] = true;
    //     });
    //     return duplicates;
    //   },
    //   b: () => {
    //     const duplicates = [];
    //     tracks.reduce((acc, track, idx) => {
    //       if (acc[track.id]) {
    //         duplicates.push({ id: track.id, position: idx });
    //       }
    //       acc[track.id] = true;
    //       return acc;
    //     }, {});
    //     return duplicates;
    //   },
    // };

    response = await PlaylistsService.removePlaylistDuplicates(
      req.user,
      '7pS43sG0C61pt7U9LcqozG'
    );
    // await PlaylistsService.addTracks(req.user, [
    //   {
    //     playlist_id: '3fq2l4tR29CfUXxgriZJ0i',
    //     track_ids: response.map(t => t.id),
    //   },
    // ]);

    // ============================================================
    console.timeEnd('getTest');
    console.log(response);
    res.send(response || 'ok');
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.post('/', (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
