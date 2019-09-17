const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({path: __dirname + '/../.env'});

app.use(express.static(path.join(__dirname, '../public')));

// Routers
const authRouter = require('./routes/authRouter');

app.use('/auth', authRouter);

// Port listening
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});