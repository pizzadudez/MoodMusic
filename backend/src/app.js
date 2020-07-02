const express = require('express');
const path = require('path');

const db = require('../db');
const { PORT } = require('./config');
const handleJSON = require('./middlewares/handleJSON');
const AuthService = require('./services/auth_');
const AuthRouter_ = require('./auth/index_');
const AuthRouter = require('./auth');
const ApiRouter = require('./routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(handleJSON());
app.set('json spaces', 2);
// Routers
app.use('/auth', AuthRouter_); // old, remove
app.use('/authorize', AuthRouter);
app.use('/api', ApiRouter);

// Initialization and recurring tasks
db.init(); // Create database and tables
AuthService.refreshToken(); // Refresh Access Token

const port = PORT || 1000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
