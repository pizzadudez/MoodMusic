import { 
  SET_LABEL_CHANGES,
  CLEAR_LABEL_CHANGES,
  SET_TRACK_CHANGES,
  CLEAR_TRACK_CHANGES,
  CLEAR_PLAYLIST_CHANGES,
} from '../actions/types';

const initialState = {
  labelsToAdd: {},
  labelsToRemove: {},
  tracksToAdd: {},
  tracksToRemove: {},
  playlists: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LABEL_CHANGES:
      return {
        ...state,
        labelsToAdd: setLabelChanges(state.labelsToAdd, action),
        labelsToRemove: setLabelChanges(state.labelsToRemove, action, false),
      }
    case SET_TRACK_CHANGES:
      return {
        ...state,
        tracksToAdd: setTrackChanges(state.tracksToAdd, action),
        tracksToRemove: setTrackChanges(state.tracksToRemove, action, false),
      }
    case CLEAR_LABEL_CHANGES:
      return {
        ...state,
        labelsToAdd: {},
        labelsToRemove: {},
      }
    case CLEAR_TRACK_CHANGES:
        return {
          ...state,
          tracksToAdd: {},
          tracksToRemove: {},
        }  
    case CLEAR_PLAYLIST_CHANGES:
      return {
        ...state,
        playlists: {}
      }
    default:
      return state;
  }
}

const setLabelChanges = (state, action, addLabels = true) => {
  switch (action.type) {
    case SET_LABEL_CHANGES:
      return {
        ...state,
        ...action.trackIds.reduce((obj, trackId) => ({
          ...obj,
          [trackId]: [
            ...state[trackId] ? state[trackId] : [],
            ...action[addLabels ? 'toAdd' : 'toRemove'].filter(id =>
              addLabels !== action.trackMap[trackId].label_ids.includes(id))
          ]
        }), {})
      }  
    default:
      return state;
  }
};
const setTrackChanges = (state, action, addTracks = true) => {
  switch (action.type) {
    case SET_TRACK_CHANGES:
      return {
        ...state,
        ...action[addTracks ? 'toAdd' : 'toRemove'].reduce((obj, playlistId) => ({
          ...obj,
          [playlistId] : [
            ...state[playlistId] ? state[playlistId] : [],
            ...action.trackIds.filter(id => 
              addTracks !== action.trackMap[id].playlist_ids.includes(playlistId))
          ]
        }), {})
      }
    default:
      return state;
  }
}