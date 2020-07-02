import {
  CONFIRM_ACTION_START,
  CONFIRM_ACTION_SUCCESS,
  CONFIRM_ACTION_CANCEL,
  SET_AUTHENTICATED,
} from './types';
import store from '../store';

// Authentication
export const authenticate = () => dispatch => {
  const { error, jwt: newToken } = getHashParams();
  const oldToken = getJwtFromStorage();
  if (newToken) setJwtInStorage(newToken);
  const jwt = newToken || oldToken || undefined;

  dispatch({ type: SET_AUTHENTICATED, payload: !!jwt });
};

// Dialog confirmation
export const confirm = options => (dispatch, getState) => {
  const { title, description } = options;
  dispatch({
    type: CONFIRM_ACTION_START,
    options: {
      title: title || '',
      description: description || '',
    },
  });

  return new Promise((resolve, reject) => {
    const listener = () => {
      const { pending, status } = getState().app.confirmation;
      if (!pending) {
        status ? resolve() : reject();
        unsubscribe();
      }
    };
    const unsubscribe = store.subscribe(listener);
  });
};
export const confirmAction = () => dispatch => {
  dispatch({ type: CONFIRM_ACTION_SUCCESS });
};
export const cancelAction = () => dispatch => {
  dispatch({ type: CONFIRM_ACTION_CANCEL });
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
