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

    response = await LabelModel.getTrackIdsNotInPlaylist(
      1,
      '7GcFeQfpn24KJd2AjYlaVv'
    );

    // ============================================================
    console.timeEnd('getTest');
    console.log(response);
    res.send(response || 'ok');
  } catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
});
router.post('/', (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
