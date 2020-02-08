import axios from 'axios';
import _ from 'lodash';
import {
  MODIFY_TRACK_SELECTION,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  SET_LABEL_CHANGES,
  CLEAR_LABEL_CHANGES,
  UPDATE_TRACKS_LABELS,
  SET_TRACK_CHANGES,
  CLEAR_TRACK_CHANGES,
  UPDATE_TRACKS_PLAYLISTS,
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
export const updateTrackLabels = data => (dispatch, getState) => {
  console.log(data);
  // dispatch({
  //   type: SET_LABEL_CHANGES,
  //   tracksById: getState().tracks.tracksById,
  //   toAdd:
  //   toRemove:
  // })
};
export const updateTrackPlaylists = () => (dispatch, getState) => {};
