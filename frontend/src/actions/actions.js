import axios from 'axios';
import {
  MODIFY_TRACK_SELECTION,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  SET_LABEL_CHANGES,
  UPDATE_TRACKS_LABELS,
  CLEAR_LABEL_CHANGES,
  DESELECT_ALL_LABELS,
  MODIFY_LABEL_SELECTION,
  CREATE_LABEL,
  MODIFY_PLAYLIST_SELECTION,
  SET_TRACK_CHANGES,
  UPDATE_TRACKS_PLAYLISTS,
} from './types';

export const createLabel = json => dispatch => {
  axios.post('/api/labels', json).then(res => {
    console.log(res.data.label)
    dispatch({
      type: CREATE_LABEL,
      label: res.data.label,
    });
  }).catch(err => console.log(err));
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
  id,
});
export const deselectAllLabels = () => dispatch => dispatch({
  type: DESELECT_ALL_LABELS,
});

// Playlist Selection
export const modifyPlaylistSelection = id => dispatch => dispatch({
  type: MODIFY_PLAYLIST_SELECTION,
  id,
});


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
export const addOrRemoveToPlaylists = (addTracks = true) => (dispatch, getState) => {
  const tracksSelectedMap = getState().tracks.selected;
  const tracksSelected = Object.keys(tracksSelectedMap)
    .filter(id => tracksSelectedMap[id]);
  const playlistsSelectedMap = getState().playlists.selected;
  const playlistsSelected = Object.keys(playlistsSelectedMap)
    .filter(id => playlistsSelectedMap[id]);
  const tracks = getState().tracks.map;
  dispatch({
    type: SET_TRACK_CHANGES,
    addTracks: addTracks,
    trackIds: tracksSelected,
    playlistIds: playlistsSelected,
    tracks: tracks,
  });
  dispatch({
    type: UPDATE_TRACKS_PLAYLISTS,
    addPlaylists: addTracks,
    playlistIds: playlistsSelected,
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
    .then(res => console.log(res))
    .catch(err => console.log(err));
  axios.post('api/labels/remove', removeLabelsBody)
    .then(res => console.log(res))
    .catch(err => console.log(err));

  dispatch({
    type: CLEAR_LABEL_CHANGES,
  });
};

export const postChanges2 = () => (dispatch, getState) => {
  const addTracksMap = getState().changes.tracksToAdd;
  const removeTracksMap = getState().changes.tracksToRemove;

  const addTracksBody = Object.keys(addTracksMap).map(playlistId => ({
    playlist_id: playlistId,
    tracks: addTracksMap[playlistId].filter(id => 
      !removeTracksMap[playlistId] || !removeTracksMap[playlistId].includes(id)
    )
  }));
  const removeTracksBody = Object.keys(removeTracksMap).map(playlistId => ({
    playlist_id: playlistId,
    tracks: removeTracksMap[playlistId].filter(id => 
      !addTracksMap[playlistId] || !addTracksMap[playlistId].includes(id)  
    )
  }));
  axios.post('api/tracks/add', addTracksBody)
    .then(res => console.log(res))
    .catch(err => console.log(err));
  axios.post('api/tracks/remove', removeTracksBody)
    .then(res => console.log(res))
    .catch(err => console.log(err));
}