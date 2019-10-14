import axios from 'axios'
import { FETCH_TRACKS, FETCH_PLAYLISTS, FETCH_LABELS, TRACKS_SEARCH } from './types';

export const fetchData = () => dispatch => {
  axios.get('/api/tracks').then(tracks => {
    const trackIds = tracks.data.map(track => track.id);
    const trackMap = tracks.data.reduce((obj, track) => {
      return { ...obj, [track.id]: track };
    }, {});
    dispatch({
      type: FETCH_TRACKS,
      ids: trackIds,
      map: trackMap,
    });
  }).catch(err => console.log(err));

  axios.get('/api/playlists').then(playlists => {
    dispatch({
      type: FETCH_PLAYLISTS,
      payload: playlists.data,
    });
  }).catch(err => console.log(err));

  axios.get('/api/labels').then(labels => {
    const labelMap = labels.data.reduce((obj, label) => {
      return { ...obj, [label.id]: label};
    }, {});
    const labelIds = labels.data.map(label => label.id);
    dispatch({
      type: FETCH_LABELS,
      ids: labelIds,
      map: labelMap,
    });
  }).catch(err => console.log(err));
};

export const createLabel = json => dispatch => {
  axios.post('/api/labels', json)
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

export const tracksSearch = filter => dispatch => {
  dispatch({
    type: TRACKS_SEARCH,
    payload: filter,
  });
};