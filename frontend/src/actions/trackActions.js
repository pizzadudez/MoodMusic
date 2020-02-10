import axios from 'axios';
import _ from 'lodash';
import {
  MODIFY_TRACK_SELECTION,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  SET_TRACK_CHANGES,
  UPDATE_TRACKS,
  CLEAR_TRACK_CHANGES,
} from './types';

// Track Selecting
export const modifyTrackSelection = id => dispatch =>
  dispatch({
    type: MODIFY_TRACK_SELECTION,
    payload: id,
  });
export const selectAllTracks = () => (dispatch, getState) => {
  const selected = getState().filter.ids.reduce(
    (obj, id) => ({ ...obj, [id]: true }),
    {}
  );
  dispatch({
    type: SELECT_ALL_TRACKS,
    selected,
  });
};
export const deselectAllTracks = () => dispatch => {
  dispatch({ type: DESELECT_ALL_TRACKS });
};

// Local update and set changes for api call
export const updateTracks = data => dispatch => {
  const { labels, playlists } = data;
  // Handle string labelIds (track.label_ids = [int])
  data.labels = {
    toAdd: data.labels.toAdd.map(Number),
    toRemove: data.labels.toRemove.map(Number),
  };
  const labelChanges = Object.values(labels).some(val => val.length);
  const playlistChanges = Object.values(playlists).some(val => val.length);

  if (labelChanges || playlistChanges) {
    dispatch({
      type: SET_TRACK_CHANGES,
      data,
    });
    dispatch({
      type: UPDATE_TRACKS,
      data,
    });
  }
};
// Request backend to implement track changes (label + playlist)
export const submitChanges = () => (dispatch, getState) => {
  const {
    labelsToAdd,
    labelsToRemove,
    playlistsToAdd,
    playlistsToRemove,
  } = getState().tracks.changes;

  const addTrackLabels = parseChangeData(labelsToAdd, 'label');
  const removeTrackLabels = parseChangeData(labelsToRemove, 'label');
  const addTrackPlaylists = parseChangeData(playlistsToAdd, 'playlist');
  const removeTrackPlaylists = parseChangeData(playlistsToRemove, 'playlist');
};

// Helpers
const parseChangeData = (changeData, fieldName) => {
  return Object.keys(changeData)
    .map(id => {
      const ids = Object.keys(_.pickBy(changeData[id]));
      if (ids.length) {
        return Object.fromEntries([
          ['track_id', id],
          [fieldName + '_ids', fieldName === 'label' ? ids.map(Number) : ids],
        ]);
      }
    })
    .filter(el => el);
};
