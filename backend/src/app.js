const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({path: __dirname + '/../.env'});
const db = require('./db');

const AuthRouter = require('./routes/auth');
const PlaylistsRouter = require('./routes/playlists');

// Routers
app.use('/auth', AuthRouter);
app.use('/playlists', PlaylistsRouter);
// Misc
app.use(express.static(path.join(__dirname, '../public')));
app.set('json spaces', 2); 

// Init db
db.init();

// Port listening
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});