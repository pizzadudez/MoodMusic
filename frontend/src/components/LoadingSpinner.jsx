import React from 'react';
import Loader from 'react-loader-spinner';

export default () => (
  <div
    style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
    }}
  >
    <Loader
      type="Audio"
      color="#6aff6a"
      height={200}
      width={200}
      style={{
        transform: 'translate(-50%,-50%)',
        position: 'absolute',
        top: '50%',
        left: '50%',
      }}
    />
  </div>
);
