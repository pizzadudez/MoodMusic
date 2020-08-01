require('dotenv-safe').config({
  allowEmptyValues: true,
});

const REACT_ENV = process.env.REACT_ENV || 'development';

module.exports = {
  PORT: process.env.PORT || 8888,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  FRONTEND_URI:
    REACT_ENV === 'development'
      ? process.env.FRONTEND_URI_DEV
      : process.env.FRONTEND_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_MINUTES: Number(process.env.JWT_REFRESH_MINUTES) || 15,
};
