import {
  FETCH_LABELS,
  DESELECT_ALL_LABELS,
  MODIFY_LABEL_SELECTION,
} from '../actions/types';

const initialState = {
  all: [],
  selected: {},
  genres: [],
  moods: [],
  subgenres: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LABELS:
      return {
        ...state,
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
    default:
      return state;
  }
}