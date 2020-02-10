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
export const modifyTrackSelection = id => dispatch => {
  dispatch({
    type: MODIFY_TRACK_SELECTION,
    payload: id,
  });
};
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
export const submitChanges = () => async (dispatch, getState) => {
  try {
    const {
      labelsToAdd,
      labelsToRemove,
      playlistsToAdd,
      playlistsToRemove,
    } = getState().tracks.changes;

    await Promise.all([
      parseAndSubmit(labelsToAdd, 'label', 'add'),
      parseAndSubmit(labelsToRemove, 'label', 'remove'),
      parseAndSubmit(playlistsToAdd, 'playlist', 'add'),
      parseAndSubmit(playlistsToRemove, 'playlist', 'remove'),
    ]);
  } catch (err) {
    console.log(err);
  }
};

// Helpers
const parseAndSubmit = (changeData, fieldName, operation) => {
  const transposed = Object.keys(changeData).reduce((obj, trackId) => {
    Object.keys(_.pickBy(changeData[trackId])).forEach(
      id => (obj[id] = [...(obj[id] || []), trackId])
    );
    return obj;
  }, {});

  const json = Object.entries(transposed).map(([id, trackIds]) => ({
    [`${fieldName}_id`]: fieldName === 'label' ? parseInt(id) : id,
    track_ids: trackIds,
  }));

  if (json.length) {
    return axios
      .post(`/api/v2/${fieldName}s/${operation}`, json)
      .catch(err => console.log(err));
  }
  return Promise.resolve('No data to send.');
};
