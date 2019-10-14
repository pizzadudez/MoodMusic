import axios from 'axios'
import { 
  FETCH_TRACKS, 
  FETCH_PLAYLISTS, 
  FETCH_LABELS, 
  TRACKS_SEARCH, 
  ADD_LABELS,
  SELECT_TRACK,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS
} from './types';

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

export const selectTrack = id => dispatch => dispatch({
  type: SELECT_TRACK,
  payload: id,
});
export const selectAllTracks = () => dispatch => dispatch({
  type: SELECT_ALL_TRACKS,
});
export const deselectAllTracks = () => dispatch => dispatch({
  type: DESELECT_ALL_TRACKS,
});

export const addLabels = (trackIds, labelIds) => dispatch => {
  if (!trackIds) return;
  const json = Object.keys(trackIds)
    .filter(id => trackIds[id])
    .map(trackId => ({
      track_id: trackId,
      label_ids: Object.keys(labelIds).filter(id => labelIds[id]),
    }));
  axios.post('/api/labels/add', json).then(() =>
    dispatch({
      type: ADD_LABELS,
      payload: json,
    })
  ).catch(err => console.log(err));
};