import axios from 'axios';
import {
  SET_AUTHORIZED,
  FETCH_TRACKS,
  FETCH_PLAYLISTS,
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
  await axios.get('/api/tracks/check');
  const fetchPlaylists = axios.get('/api/playlists').then(res => {
    dispatch({ type: FETCH_PLAYLISTS, payload: res.data });
  });
  const fetchTracks = axios.get('/api/tracks').then(res => {
    dispatch({ type: FETCH_TRACKS, payload: res.data });
  });
  const fetchLabels = axios.get('/api/labels').then(res => {
    dispatch({ type: FETCH_LABELS, payload: res.data });
  });
  await Promise.all([fetchPlaylists, fetchTracks, fetchLabels, ]);
  // done fetching data
  dispatch({ type: LOADING_FINISHED });
};
export const fetchUpdates = () => dispatch => {
  axios.get('/api/tracks/check').then(res => {
    if (res.data.playlists) {
      const { map, ids, types } = parsePlaylists(res.data.playlists);
      dispatch({ type: FETCH_PLAYLISTS, map, ids, types });
    }
    if (res.data.tracks) {
      const { map, ids, liked } = parseTracks(res.data.tracks);
      dispatch({ type: FETCH_TRACKS, map, ids, liked });
    }
  })
};

/* Helpers */
const arrayToMap = arr => arr.reduce((obj, item) => ({
  ...obj,
  [item.id]: item,
}), {});
export const parseTracks = tracks => ({
  map: arrayToMap(tracks),
  ids: tracks.map(obj => obj.id),
  liked: tracks.filter(obj => obj.liked).map(obj => obj.id)
});
export const parsePlaylists = playlists => {
  const map = arrayToMap(playlists);
  const ids = playlists.map(obj => obj.id);
  const types = ids.reduce((obj, id) => {
    const { mood_playlist } = map[id];
    mood_playlist ? obj.custom.push(id) : obj.default.push(id);
    return obj;
  }, { 'default': [], 'custom': [] });
  return { map, ids, types };
};
const parseLabelsOld = labels => {
  const map = arrayToMap(labels);
  const ids = labels.map(obj => obj.id);
  const types = ids.reduce((obj, id) => {
    const { type, parent_id } = map[id];
    type === 'subgenre'
      ? obj[type][parent_id] = [...obj[type][parent_id] || [], id]
      : obj[type].push(id);
    return obj;
  }, { 'genre': [], 'mood': [], 'subgenre': {} })
  return { map, ids, types };
};