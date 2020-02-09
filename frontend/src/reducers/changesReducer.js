import { SET_TRACK_CHANGES } from '../actions/types';

const initialState = {
  labelsToAdd: {},
  labelsToRemove: {},
  playlistsToAdd: {},
  playlistsToRemove: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TRACK_CHANGES:
      setChanges(state, action);
    default:
      return state;
  }
};

const setChanges = (state, action) => {
  const {
    tracks,
    tracksById,
    labelsToAdd,
    labelsToRemove,
    playlistsToAdd,
    playlistsToRemove,
  } = action.data;

  return {
    ...state,
  };
};
