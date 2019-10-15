import axios from 'axios'
import { 
  FETCH_TRACKS, 
  FETCH_PLAYLISTS, 
  FETCH_LABELS, 
  TRACKS_SEARCH, 
  MODIFY_TRACK_SELECTION,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  SET_LABEL_CHANGES,
  UPDATE_TRACKS_LABELS,
  CLEAR_LABEL_CHANGES
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
export const tracksSearch = filter => (dispatch, getState) => {
  dispatch({
    type: TRACKS_SEARCH,
    payload: filter,
    tracks: getState().tracks,
  });
};

// Track Selection
export const modifyTrackSelection = id => dispatch => dispatch({
  type: MODIFY_TRACK_SELECTION,
  payload: id,
});
export const selectAllTracks = () => dispatch => dispatch({
  type: SELECT_ALL_TRACKS,
});
export const deselectAllTracks = () => dispatch => dispatch({
  type: DESELECT_ALL_TRACKS,
});

// export const addLabels = labelIdsMap => (dispatch, getState) => {
//   const trackIdsSelectedMap = getState().trackIds.selected;
//   const json = Object.keys(trackIdsSelectedMap)
//     .filter(id => trackIdsSelectedMap[id])
//     .map(trackId => ({
//       track_id: trackId,
//       label_ids: Object.keys(labelIdsMap)
//           .filter(labelId => labelIdsMap[labelId])
//           .map(id => parseInt(id)),
//     }));
//   dispatch({
//     type: ADD_LABELS,
//     payload: json,
//     tracks: getState().tracks,
//   });
// };

export const addOrRemoveLabels = (labelIdsMap, addLabels = true) => (dispatch, getState) => {
  const trackIdsSelectedMap = getState().trackIds.selected;
  const trackIdsSelected = Object.keys(trackIdsSelectedMap)
    .filter(id => trackIdsSelectedMap[id]);
  const labelIds = Object.keys(labelIdsMap)
    .filter(id => labelIdsMap[id])
    .map(id => parseInt(id));
  const tracks = getState().tracks
  dispatch({
    type: SET_LABEL_CHANGES,
    addLabels: addLabels,
    trackIds: trackIdsSelected,
    labelIds: labelIds,
    tracks: tracks,
  })
  dispatch({
    type: UPDATE_TRACKS_LABELS,
    addLabels: addLabels,
    trackIds: trackIdsSelected,
    labelIds: labelIds,
  });
};

export const postChanges = () => (dispatch, getState) => {
  const addLabelsMap = getState().changes.labelsToAdd;
  const removeLabelsMap = getState().changes.labelsToRemove;

  const addLabelsBody = Object.keys(addLabelsMap).map(trackId => ({
    track_id: trackId,
    label_ids: addLabelsMap[trackId].filter(id => !removeLabelsMap[trackId] || !removeLabelsMap[trackId].includes(id))
  }));
  const removeLabelsBody = Object.keys(removeLabelsMap).map(trackId => ({
    track_id: trackId,
    label_ids: removeLabelsMap[trackId].filter(id => !addLabelsMap[trackId] || !addLabelsMap[trackId].includes(id))
  }));

  axios.post('api/labels/add', addLabelsBody)
    .then(res => console.log(res));
  axios.post('api/labels/remove', removeLabelsBody)
    .then(res => console.log(res));

  dispatch({
    type: CLEAR_LABEL_CHANGES,
  });
};