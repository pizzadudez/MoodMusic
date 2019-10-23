import {
  FETCH_TRACKS,
  MODIFY_TRACK_SELECTION,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  UPDATE_TRACKS_LABELS,
} from '../actions/types';

const initialState = {
  map: {},
  all: [],
  filtered: [],
  searchFiltered: [],
  selected: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRACKS:
      return {
        ...state,
        map: action.map,
        all: action.ids,
        filtered: action.ids
      }
    case MODIFY_TRACK_SELECTION:
      return {
        ...state,
        selected: {
          ...state.selected,
          [action.payload]: !state.selected[action.payload]
        }
      }
    case SELECT_ALL_TRACKS:
      return {
        ...state,
        selected: action.selected
      }    
    case DESELECT_ALL_TRACKS:
      return {
        ...state,
        selected: {}
      }
    case UPDATE_TRACKS_LABELS:
      return {
        ...state,
        map: {
          ...state.map,
          ...Object.keys(state.selected)
            .filter(id => state.selected[id])
            .reduce((obj, id) => ({
              ...obj,
              [id]: {
                ...state.map[id],
                label_ids: [
                  ...state.map[id].label_ids.filter(id => !action.labelIds.includes(id)),
                  ...action.addLabels ? action.labelIds : []
                ]
              }
            }), {})
        }
      }
    default:
      return state;
  }
}