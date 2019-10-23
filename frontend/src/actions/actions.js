import axios from 'axios'
import { 
  FETCH_TRACKS, 
  FETCH_PLAYLISTS, 
  FETCH_LABELS,
  MODIFY_TRACK_SELECTION,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  SET_LABEL_CHANGES,
  UPDATE_TRACKS_LABELS,
  CLEAR_LABEL_CHANGES,
  DESELECT_ALL_LABELS,
  MODIFY_LABEL_SELECTION,
  LOADING_FINISHED,
} from './types';

export const fetchData = () => async dispatch => {
  const tracks = axios.get('/api/tracks').then(tracks => {
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

  const playlists = axios.get('/api/playlists').then(playlists => {
    const playlistMap = ArrayToMap(playlists.data);
    const playlistIds = playlists.data.map(item => item.id);
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

  const labels = axios.get('/api/labels').then(labels => {
    const labelMap = labels.data.reduce((obj, label) => {
      return { ...obj, [label.id]: label};
    }, {});
    const labelIds = labels.data.map(label => label.id);
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

  await Promise.all([tracks, playlists, labels]);
  dispatch({
    type: LOADING_FINISHED,
  });
};

export const createLabel = json => dispatch => {
  axios.post('/api/labels', json)
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

// Track Selection
export const modifyTrackSelection = id => dispatch => dispatch({
  type: MODIFY_TRACK_SELECTION,
  payload: id,
});
export const selectAllTracks = () => (dispatch, getState) => {
  const selected = getState().filter.tracks
    .reduce((obj, id) => ({ ...obj, [id]: true }), {})
  dispatch({
    type: SELECT_ALL_TRACKS,
    selected,
  });
};
export const deselectAllTracks = () => dispatch => dispatch({
  type: DESELECT_ALL_TRACKS,
});

// Label Selection
export const modifyLabelSelection = id => dispatch => dispatch({
  type: MODIFY_LABEL_SELECTION,
  payload: id,
});
export const deselectAllLabels = () => dispatch => dispatch({
  type: DESELECT_ALL_LABELS
})


export const addOrRemoveLabels = (addLabels = true) => (dispatch, getState) => {
  const tracksSelectedMap = getState().tracks.selected;
  const tracksSelected = Object.keys(tracksSelectedMap)
    .filter(id => tracksSelectedMap[id]);
  const labelsSelectedMap = getState().labels.selected;
  const labelsSelected = Object.keys(labelsSelectedMap)
    .filter(id => labelsSelectedMap[id])
    .map(id => parseInt(id));
  const tracks = getState().tracks.map;
  dispatch({
    type: SET_LABEL_CHANGES,
    addLabels: addLabels,
    trackIds: tracksSelected,
    labelIds: labelsSelected,
    tracks: tracks,
  })
  dispatch({
    type: UPDATE_TRACKS_LABELS,
    addLabels: addLabels,
    labelIds: labelsSelected,
  });
  dispatch({
    type: DESELECT_ALL_LABELS,
  })
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

/* Helpers */
const ArrayToMap = arr => arr.reduce((obj, item) => ({
  ...obj,
  [item.id]: item,
}), {});