import axios from 'axios';
import _ from 'lodash';
import {
  MODIFY_TRACK_SELECTION,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  SET_TRACK_CHANGES,
  UPDATE_TRACKS,
  CLEAR_TRACK_CHANGES,
  TOGGLE_TRACK_LIKE,
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
export const updateTracks = data => (dispatch, getState) => {
  const { labels, playlists, trackId } = data;
  const labelsById = getState().labels.labelsById;

  const parsedLabels = {
    toAdd: Object.keys(_.pickBy(labels && labels.toAdd)).map(Number),
    toRemove: Object.keys(_.pickBy(labels && labels.toRemove)).map(Number),
  };
  const parsedPlaylists = {
    toAdd: [
      ...Object.keys(_.pickBy(playlists && playlists.toAdd)),
      ...parsedLabels.toAdd
        .map(id => labelsById[id].playlist_id)
        .filter(Boolean),
    ],
    toRemove: [
      ...Object.keys(_.pickBy(playlists && playlists.toRemove)),
      ...parsedLabels.toRemove
        .map(id => labelsById[id].playlist_id)
        .filter(Boolean),
    ],
  };
  const parsedData = {
    labels: parsedLabels,
    playlists: parsedPlaylists,
    trackId,
  };

  const changes =
    Object.values(parsedLabels).some(val => val.length) ||
    Object.values(parsedPlaylists).some(val => val.length);
  if (changes) {
    dispatch({
      type: SET_TRACK_CHANGES,
      data: parsedData,
    });
    dispatch({
      type: UPDATE_TRACKS,
      data: parsedData,
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
    dispatch({ type: CLEAR_TRACK_CHANGES });
  } catch (err) {
    console.log(err);
  }
};

export const toggleLike = (id, toggle) => dispatch => {
  axios
    .patch('/api/track/' + id + '/like', { toggle })
    .then(() => dispatch({ type: TOGGLE_TRACK_LIKE, id, toggle }));
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
      .post(`/api/${fieldName}s/${operation}`, json)
      .catch(err => console.log(err));
  }
  return Promise.resolve('No data to send.');
};
