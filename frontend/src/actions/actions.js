import axios from 'axios'
import { FETCH_TRACKS, FETCH_PLAYLISTS, FETCH_LABELS } from './types';

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
    dispatch({
      type: FETCH_LABELS,
      payload: labels.data,
    });
  }).catch(err => console.log(err));
};