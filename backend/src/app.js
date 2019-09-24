const express = require('express');
const path = require('path');
const db = require('./models/db');
const config = require('./config');

const AuthRouter = require('./auth');
// const ApiRouter = require();

const app = express();
// Routers
app.use('/auth', AuthRouter);
// app.use('/api', ApiRouter);
// Misc
app.use(express.static(path.join(__dirname, '../public')));
app.set('json spaces', 2);

// Init database
db.init();

const port = config.port || 1000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});