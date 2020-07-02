import axios from 'axios';
import {
  FETCH_PLAYLISTS,
  FETCH_TRACKS,
  FETCH_LABELS,
  LOADING_FINISHED,
} from './types';

export const fetchData = () => async dispatch => {
  try {
    const tracks = await axios.get('/api/tracks/refresh');
    dispatch({ type: FETCH_TRACKS, payload: tracks.data.tracks });

    const playlists = axios.get('/api/playlists');
    const labels = axios.get('/api/labels');
    const [playlistsRes, labelsRes] = await Promise.all([playlists, labels]);
    dispatch({ type: FETCH_PLAYLISTS, payload: playlistsRes.data });
    dispatch({ type: FETCH_LABELS, payload: labelsRes.data });
    dispatch({ type: LOADING_FINISHED });
  } catch (err) {
    console.log(err);
  }
};
export const fetchTracks = () => async dispatch => {
  const response = await axios.get('/api/tracks');
  dispatch({ type: FETCH_TRACKS, payload: response.data });
};
export const fetchPlaylists = () => async dispatch => {
  const response = await axios.get('/api/playlists');
  dispatch({ type: FETCH_PLAYLISTS, payload: response.data });
};
export const fetchLabels = () => async dispatch => {
  const response = await axios.get('/api/labels');
  dispatch({ type: FETCH_LABELS, payload: response.data });
};

export const syncData = () => async (dispatch, getState) => {
  try {
    const tracksRes = await axios.get('/api/tracks/sync');
    dispatch({ type: FETCH_TRACKS, payload: tracksRes.data.tracks });
  } catch (err) {
    console.log(err);
  }
};
