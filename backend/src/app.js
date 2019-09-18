const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({path: __dirname + '/../.env'});

app.use(express.static(path.join(__dirname, '../public')));

// Routers
const AuthRouter = require('./routes/auth');
const PlaylistsRouter = require('./routes/playlists');

app.use('/auth', AuthRouter);
app.use('/playlists', PlaylistsRouter);

// Port listening
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});