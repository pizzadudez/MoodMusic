import axios from 'axios';

// Intercept refreshed jwt in response
axios.interceptors.response.use(res => {
  const { jwt } = res.data;
  delete res.data.jwt; // TODO: remove this once reducers no longer fuck this up
  if (jwt) {
    setJwtInStorage(jwt);
    setAuthHeader(jwt);
    console.log('new jwt intercepted and handled');
  }
  return res;
});

export const getJwt = () => {
  const { error, jwt: newToken } = getHashParams();
  const oldToken = getJwtFromStorage();
  if (newToken) setJwtInStorage(newToken);
  return newToken || oldToken || undefined;
};
export const setAuthHeader = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer: ${token}`;
};

// Helpers
const getHashParams = () => {
  const hashParams = {};
  let e;
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
};
const getJwtFromStorage = () => window.localStorage.getItem('jwt');
const setJwtInStorage = token => window.localStorage.setItem('jwt', token);
