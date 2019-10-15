import {
  FETCH_TRACKS,
  UPDATE_TRACKS_LABELS,
} from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_TRACKS:
      return {
        ...state,
        ...action.map
      }
    case UPDATE_TRACKS_LABELS:
      return {
        ...state,
        ...action.trackIds.reduce((obj, trackId) => ({
          ...obj,
          [trackId]: {
            ...state[trackId],
            label_ids: [
              ...state[trackId].label_ids.filter(id => !action.labelIds.includes(id)),
              ...action.addLabels ? action.labelIds : []
            ]
          }
        }), {})
      }
    default:
      return state;
  }
}