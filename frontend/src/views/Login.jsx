import React, { memo } from 'react';
import axios from 'axios';

export default memo(() => {
  const authorizeUrl =
    process.env.NODE_ENV === ''
      ? 'http://localhost:8888/authorize'
      : `${axios.defaults.baseURL}/authorize`;
  return (
    <div>
      <h1>Login using Spotify</h1>
      <a href={authorizeUrl}>
        <button>Authorize</button>
      </a>
    </div>
  );
});
