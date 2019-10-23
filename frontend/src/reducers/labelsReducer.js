import {
  FETCH_LABELS,
  MODIFY_LABEL_SELECTION,
  DESELECT_ALL_LABELS,
  MODIFY_LABEL_FILTER,
} from "../actions/types";

const initialState = {
  map: {},
  all: [],
  genres: [],
  moods: [],
  subgenres: {},
  selected: {},
  filter: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LABELS:
      return {
        ...state,
        map: action.map,
        all: action.ids,
        genres: action.types.genre,
        moods: action.types.mood,
        subgenres: action.types.subgenre,
      }
    case MODIFY_LABEL_SELECTION:
      return {
        ...state,
        selected: {
          ...state.selected,
          [action.payload]: !state.selected[action.payload]
        }
      }
    case DESELECT_ALL_LABELS:
      return {
        ...state,
        selected: {}
      }
    case MODIFY_LABEL_FILTER:
      return {
        ...state,
        filter: filterChange(state.filter, action.payload)
      }
    default:
      return state;
  }
}

const filterChange = (state, id) => {
  if (state[id] === false) {
    delete state[id];
    return state;
  } else {
    return {
      ...state,
      [id]: state[id] === true ? false : true,
    }
  }
}