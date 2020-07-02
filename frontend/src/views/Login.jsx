import React, { memo } from 'react';

export default memo(() => {
  return (
    <div>
      <h1>Login using Spotify</h1>
      <a href="http://localhost:8888/authorize">
        <button onClick={() => console.log('authTest')}>Authorize</button>
      </a>
    </div>
  );
});
