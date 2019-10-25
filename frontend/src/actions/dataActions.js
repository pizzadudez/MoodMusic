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
  
  await Promise.all([
    fetchTracks(dispatch),
    fetchPlaylists(dispatch),
    fetchLabels(dispatch)
  ]);
  dispatch({ type: LOADING_FINISHED });
};
export const fetchUpdates = () => async dispatch => {
  axios.get('/api/tracks/check').then(res => {
    
  })
}

const fetchTracks = async dispatch => {
  await axios.get('/api/tracks').then(res => dispatch({
    type: FETCH_TRACKS,
    map: arrayToMap(res.data),
    ids: res.data.map(obj => obj.id),
  })).catch(err => console.log(err));
};
const fetchPlaylists = async dispatch => {
  await axios.get('/api/playlists').then(res => {
    const playlistMap = arrayToMap(res.data);
    const playlistIds = res.data.map(item => item.id);
    const types = playlistIds.reduce((obj, id) => {
      const { mood_playlist } = playlistMap[id];
      mood_playlist ? obj.custom.push(id) : obj.default.push(id);
      return obj;
    }, { 'default': [], 'custom': [] });
    dispatch({
      type: FETCH_PLAYLISTS,
      map: playlistMap,
      ids: playlistIds,
      types: types,
    });
  }).catch(err => console.log(err));
};
const fetchLabels = async dispatch => {
  await axios.get('/api/labels').then(res => {
    const labelMap = arrayToMap(res.data);
    const labelIds = res.data.map(label => label.id);
    const types = labelIds.reduce((obj, id) => {
      const { type, parent_id } = labelMap[id];
      type === 'subgenre'
        ? obj[type][parent_id] = [...obj[type][parent_id] || [], id]
        : obj[type].push(id);
      return obj;
    }, { 'genre': [], 'mood': [], 'subgenre': {} })
    dispatch({
      type: FETCH_LABELS,
      ids: labelIds,
      map: labelMap,
      types: types,
    });
  }).catch(err => console.log(err));
};

/* Helpers */
const arrayToMap = arr => arr.reduce((obj, item) => ({
  ...obj,
  [item.id]: item,
}), {});
