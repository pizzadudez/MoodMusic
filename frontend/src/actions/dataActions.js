import axios from 'axios';
import {
  SET_AUTHORIZED,
  FETCH_PLAYLISTS,
  FETCH_TRACKS,
  FETCH_LABELS,
  LOADING_FINISHED,
} from './types';

export const fetchData = () => async dispatch => {
  const authorized = await axios.get('/auth/check').then(res => {
    dispatch({
      type: SET_AUTHORIZED,
      payload: res.data.authorized,
    });
    return res.data.authorized;
  });
  if (!authorized) return;

  // update playlists
  await axios.get('/api/tracks/refresh');
  const fetchPlaylists = axios.get('/api/playlists').then(res => {
    dispatch({ type: FETCH_PLAYLISTS, payload: res.data });
  });
  const fetchTracks = axios.get('/api/tracks').then(res => {
    dispatch({ type: FETCH_TRACKS, payload: res.data });
  });
  const fetchLabels = axios.get('/api/labels').then(res => {
    dispatch({ type: FETCH_LABELS, payload: res.data });
  });
  await Promise.all([fetchPlaylists, fetchTracks, fetchLabels]);
  // done fetching data
  dispatch({ type: LOADING_FINISHED });
};
export const syncData = () => dispatch => {
  axios.get('/api/tracks/sync').then(res => {
    if (res.data.playlists) {
      dispatch({ type: FETCH_PLAYLISTS, payload: res.data.playlists });
    }
    if (res.data.tracks) {
      dispatch({ type: FETCH_TRACKS, payload: res.data.tracks });
    }
  });
};
