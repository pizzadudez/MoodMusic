const express = require('express');
const request = require('request');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

let access_token;
let refresh_token;
let user_id;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/api/playlists', (req, res) => {
  res.send('api playlists');
});

app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    'client_id=' + process.env.CLIENT_ID +
    '&response_type=code' +
    (scope ? '&scope=' + encodeURIComponent(scope) : '') +
    '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI)
  );
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  // TODO: stored state here
  const redirect_uri = process.env.REDIRECT_URI;
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  }

  request.post(authOptions, (err, res, body) => {
    if (err || res.statusCode !== 200) { return null; }
    access_token = body.access_token;
    refresh_token = body.refresh_token;
    const options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
    request.get(options, (err, res, body) => {
      user_id = body.id;
      console.log(user_id);
    });
  });

  res.redirect('/');
});

app.get('/playlists', (req, res) => {
  console.log(user_id);
  const authOptions = {
    url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true,
  }
  console.log(authOptions.url);
  request.get(authOptions, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.log(err);
      return;
    }
    //console.log(body);
  });

  res.redirect('/');
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});