import { 
  SET_LABEL_CHANGES,
  CLEAR_LABEL_CHANGES,
  SET_TRACK_CHANGES,
} from '../actions/types';

const initialState = {
  labelsToAdd: {},
  labelsToRemove: {},
  tracksToAdd: {},
  tracksToRemove: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LABEL_CHANGES:
      return {
        ...state,
        labelsToAdd: action.addLabels 
          ? setLabelChanges(state.labelsToAdd, action) 
          : state.labelsToAdd,
        labelsToRemove: !action.addLabels
          ? setLabelChanges(state.labelsToRemove, action) 
          : state.labelsToRemove,
      }
    case SET_TRACK_CHANGES:
      return {
        ...state,
        tracksToAdd: action.addTracks
          ? setTrackChanges(state.tracksToAdd, action)
          : state.tracksToAdd,
        tracksToRemove: !action.addTracks
          ? setTrackChanges(state.tracksToRemove, action)
          : state.tracksToRemove,
      }
    case CLEAR_LABEL_CHANGES:
      return {
        ...state,
        labelsToAdd: {},
        labelsToRemove: {},
      }
    default:
      return state;
  }
}

const setLabelChanges = (state, action) => {
  switch (action.type) {
    case SET_LABEL_CHANGES:
      return {
        ...state,
        ...action.trackIds.reduce((obj, trackId) => ({
          ...obj,
          [trackId]: [
            ...state[trackId] ? state[trackId] : [],
            ...action.labelIds.filter(id =>
              action.addLabels !== action.tracks[trackId].label_ids.includes(id)
            )
          ]
        }), {})
      }
    default:
      return state;
  }
};
const setTrackChanges = (state, action) => {
  switch (action.type) {
    case SET_TRACK_CHANGES:
      return {
        ...state,
        ...action.playlistIds.reduce((obj, playlistId) => ({
          ...obj,
          [playlistId]: [
            ...state[playlistId] ? state[playlistId] : [],
            ...action.trackIds.filter(id =>
              action.addTracks !== action.tracks[id].playlist_ids.includes(playlistId)  
            )
          ]
        }), {})
      }
  }
}