const express = require('express');
const path = require('path');
const cors = require('cors');

const { PORT } = require('./config');
const handleJson = require('./middleware/handleJson');
const AuthRouter = require('./auth');
const ApiRouter = require('./routes');
const DocsRouter = require('./docs');

const app = express();
app.use(express.static(path.join(__dirname, '../../frontend/build')));
// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(handleJson);
app.set('json spaces', 2);
// Routers
app.use('/authorize', AuthRouter);
app.use('/api', ApiRouter);
app.use('/docs', DocsRouter);
// Dev only: let React Router handle all remaining routes
if (process.env.NODE_ENV !== 'production') {
  app.use('*', express.static(path.join(__dirname, '../../frontend/build')));
}

app.listen(PORT, () => {
  console.log(`MoodMusic server running on port: ${PORT}`);
});
