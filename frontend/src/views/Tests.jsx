import React, { memo } from 'react';
import axios from 'axios';

const testApi = async verb => {
  const url = '/api/test/auth';
  await axios[verb](url);
};
const testGet = () => testApi('get');

export default memo(() => {
  return (
    <div>
      <h1>Test backend route with auth</h1>
      <button onClick={testGet}>GET REQUEST</button>
    </div>
  );
});
