const express = require('express');
// const path = require('path');
require('../db').init(); // Init old sqlite3 db (create tables)

const { PORT } = require('./config');
const handleJson = require('./middleware/handleJson');
const AuthRouter = require('./auth');
const ApiRouter = require('./routes');
const DocsRouter = require('./docs');
const TestRouter = require('./routes/test');

const app = express();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(handleJson);
app.set('json spaces', 2);
// Routers
app.use('/authorize', AuthRouter);
app.use('/api', ApiRouter);
app.use('/docs', DocsRouter);
app.use('/test', TestRouter);

const port = PORT || 1000;
app.listen(port, () => {
  console.log(`MoodMusic server running on port: ${port}`);
});
