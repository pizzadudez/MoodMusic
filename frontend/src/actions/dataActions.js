import axios from 'axios';
import {
  SET_AUTHORIZED,
  FETCH_PLAYLISTS,
  FETCH_TRACKS,
  FETCH_LABELS,
  LOADING_FINISHED,
} from './types';

export const fetchData = () => async dispatch => {
  try {
    const authRes = await axios.get('/auth/check');
    const authorized = authRes.data.authorized;
    dispatch({ type: SET_AUTHORIZED, payload: authorized });
    if (!authorized) return;

    const tracks = axios.get('/api/tracks/refresh');
    const playlists = axios.get('/api/playlists');
    const labels = axios.get('/api/labels');
    const [tracksRes, playlistsRes, labelsRes] = await Promise.all([
      tracks,
      playlists,
      labels,
    ]);
    dispatch({ type: FETCH_TRACKS, payload: tracksRes.data.tracks });
    dispatch({ type: FETCH_PLAYLISTS, payload: playlistsRes.data });
    dispatch({ type: FETCH_LABELS, payload: labelsRes.data });
    dispatch({ type: LOADING_FINISHED });
  } catch (err) {
    console.log(err);
  }
};

export const syncData = () => async (dispatch, getState) => {
  try {
    const tracksRes = await axios.get('/api/tracks/sync');
    dispatch({ type: FETCH_TRACKS, payload: tracksRes.data.tracks });
  } catch (err) {
    console.log(err);
  }
};
