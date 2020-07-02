require('dotenv-safe').config({
  allowEmpty: true,
});

module.exports = {
  PORT: process.env.PORT,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  FRONTEND_URI: process.env.FRONTEND_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
