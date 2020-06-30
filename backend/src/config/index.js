require('dotenv-safe').config({
  allowEmpty: true,
});

module.exports = {
  port: process.env.PORT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  frontendUri: process.env.FRONTEND_URI,
};
