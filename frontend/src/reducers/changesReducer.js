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
      return setLabelChanges(state, action)
    case SET_TRACK_CHANGES:
      // return {
      //   ...state,
      //   tracksToAdd: {
      //     ...state.tracksToAdd,
      //     ...action.toAdd.reduce((obj, playlistId) => ({
      //       ...obj,
      //       [playlistId]: [
      //         ...!state.tracksToAdd[playlistId] ? [] : state.tracksToAdd[playlistId].filter(id =>
      //           !action.toRemove.includes(id))
      //         ...action.track
      //       ]
      //     }), {})
      //   }
      // }
      return {
        ...state,
        tracksToAdd: setTrackChangesOld(state.tracksToAdd, action),
        tracksToRemove: setTrackChangesOld(state.tracksToRemove, action, false),
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

// WORKING!
const setLabelChanges = (state, action) => {
  const { labelsToAdd, labelsToRemove } = state;
  const newLabelsToAdd = {
    ...labelsToAdd,
    ...action.trackIds.reduce((obj, trackId) => ({
      ...obj,
      [trackId]: {
        ...labelsToAdd[trackId],
        ...action.toAdd.reduce((obj, labelId) => {
          const labelIds = action.trackMap[trackId].label_ids;
          const firstOperation = !labelsToRemove[trackId]
            || labelsToRemove[trackId][labelId] === undefined;
          if (!labelIds.includes(labelId) && firstOperation) {
            obj[labelId] = true;
          } else if (labelsToRemove[trackId][labelId]) {
            labelsToRemove[trackId][labelId] = false;
          }
          return obj;
        }, {})
      }
    }), {})
  };
  const newLabelsToRemove = {
    ...labelsToRemove,
    ...action.trackIds.reduce((obj, trackId) => ({
      ...obj,
      [trackId]: {
        ...labelsToRemove[trackId],
        ...action.toRemove.reduce((obj, labelId) => {
          const labelIds = action.trackMap[trackId].label_ids;
          const firstOperation = labelsToAdd[trackId][labelId] === undefined;
          if (labelIds.includes(labelId) && firstOperation) {
            obj[labelId] = true;
          } else if (labelsToAdd[trackId][labelId]) {
            newLabelsToAdd[trackId][labelId] = false;
          }
          return obj;
        }, {})
      }
    }), {})
  };
  return {
    ...state,
    labelsToAdd: newLabelsToAdd,
    labelsToRemove: newLabelsToRemove
  }
};




// First try (works)
const setLabelChangesFirst = (state, action) => {
  const { labelsToAdd, labelsToRemove } = state;
  const newLabelsToAdd = {
    ...labelsToAdd,
    ...action.trackIds.reduce((obj, trackId) => ({
      ...obj,
      [trackId]: {
        ...labelsToAdd[trackId],
        ...action.toAdd.reduce((obj, labelId) => {
          if (labelsToRemove[trackId] && labelsToRemove[trackId][labelId]) {
            labelsToRemove[trackId][labelId] = false;
          } else if (!action.trackMap[trackId].label_ids.includes(labelId)
           && (!labelsToRemove[trackId] || labelsToRemove[trackId][labelId] === undefined)) {
            obj[labelId] = true;
          }
          return obj;
        }, {})
      }
    }), {})
  }
  const newLabelsToRemove = {
    ...labelsToRemove,
    ...action.trackIds.reduce((obj, trackId) => ({
      ...obj,
      [trackId]: {
        ...labelsToRemove[trackId],
        ...action.toRemove.reduce((obj, labelId) => {
          if (labelsToAdd[trackId] && labelsToAdd[trackId][labelId]) {
            newLabelsToAdd[trackId][labelId] = false;
          } else if (action.trackMap[trackId].label_ids.includes(labelId)
           && (!labelsToAdd[trackId] || labelsToAdd[trackId][labelId] === undefined)) {
            obj[labelId] = true;
          }
          return obj;
        }, {})
      }
    }), {})
  }
  return {
    ...state,
    labelsToAdd: newLabelsToAdd,
    labelsToRemove: newLabelsToRemove,
  };
};
// Doesnt work with multiple add/remove operations
const setLabelChangesOld = (state, action, addLabels = true) => {
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
const setTrackChangesOld = (state, action, addTracks = true) => {
  switch (action.type) {
    case SET_TRACK_CHANGES:
      return {
        ...state,
        ...action[addTracks ? 'toAdd' : 'toRemove'].reduce((obj, playlistId) => ({
          ...obj,
          [playlistId]: [
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