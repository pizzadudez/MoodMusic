const UserModel = require('../models/User');

const FORBIDDEN = `Forbidden: Request contains resource identifiers\
that do not belong to the user.`;

const authorizeResources = type => async (req, res, next) => {
  const { userId } = req.user;
  let authorized = true;

  switch (type) {
    case 'labelTracks': {
      const labelIds = req.body.map(({ label_id }) => label_id);
      authorized = await UserModel.checkLabels(userId, labelIds);
      break;
    }
    case 'playlistTracks': {
      const playlistIds = req.body.map(({ playlist_id }) => playlist_id);
      authorized = await UserModel.checkPlaylists(userId, playlistIds);
      break;
    }
    // TODO! for single ids new UserModel methods OR 1 method
    // (userId, resourceType, id | id[])
    case 'label': {
      authorized = await UserModel.checkLabels(userId, [req.params.id]);
      break;
    }
    case 'playlist': {
      authorized = await UserModel.checkPlaylists(userId, [req.params.id]);
      break;
    }
  }

  if (authorized) next();
  else res.status(403).json({ message: FORBIDDEN });
};

module.exports = authorizeResources;
