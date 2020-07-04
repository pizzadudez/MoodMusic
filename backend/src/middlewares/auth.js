const jwt = require('jsonwebtoken');
const AuthService = require('../services/auth');
const { FRONTEND_URI, JWT_SECRET } = require('../config');

exports.authenticateJwt = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // TODO change where to redirect ??
  if (!token) return res.redirect(FRONTEND_URI);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = {
      spotifyId: payload.spotify_id,
      accessToken: payload.access_token,
      iat: payload.iat,
    };
    next();
  });
};

exports.refreshJwt = async (req, res, next) => {
  try {
    const { iat, spotifyId } = req.user;
    const lifeTime = 60 * 58; // 2 min before expiration
    const exp = iat + lifeTime;
    const now = Math.floor(new Date() / 1000);

    if (exp < now) {
      // Generate new JWT with fresh access_token
      const { access_token, iat } = await AuthService.refreshToken(spotifyId);
      const jwt = AuthService.signJwt({
        spotify_id: spotifyId,
        access_token,
        iat,
      });
      // Update req.user for this request
      req.user = {
        ...req.user,
        accessToken: access_token,
        iat,
      };
      // Inject jwt property before sending res.json
      const originalMethod = res.json;
      res.json = data => {
        res.json = originalMethod;
        return res.json({ jwt, ...data });
      };
      console.log(`JWT refreshed for user: ${spotifyId}`);
    }
    next();
  } catch (err) {
    console.log(err.stack);
  }
};
