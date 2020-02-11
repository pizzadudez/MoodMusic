const express = require('express');
const path = require('path');

const db = require('./_models/db');
const config = require('./config');
const handleJSON = require('./middlewares/handleJSON');
const AuthServices = require('./_services/auth');
const AuthRouter = require('./auth');
const ApiRouter = require('./routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(handleJSON());
app.set('json spaces', 2);
// Routers
app.use(express.static(path.join(__dirname, '../public')));
app.use('/auth', AuthRouter);
app.use('/api', ApiRouter);

// Initialization and recurring tasks
db.init(); // Create database and tables
AuthServices.refreshToken(); // Refresh Access Token

const port = config.port || 1000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
