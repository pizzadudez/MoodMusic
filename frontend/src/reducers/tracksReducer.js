import {
  FETCH_TRACKS,
  ADD_LABELS,
} from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_TRACKS:
      return {
        ...state,
        ...action.map
      }
    case ADD_LABELS:
      return {
        ...state,
        ...action.payload.reduce((obj, { track_id, label_ids }) => ({
          ...obj,
          [track_id]: {
            ...state[track_id],
            label_ids: [... new Set([...state[track_id].label_ids, ...label_ids])]
          }
        }), {})
      }
    default:
      return state;
  }
}