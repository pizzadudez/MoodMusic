import {
  FETCH_LABELS,
  CREATE_LABEL,
} from "../actions/types";

const initialState = {
  map: {},
  all: [],
  genres: [],
  moods: [],
  subgenres: {},
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
    case CREATE_LABEL:
      return {
        ...state,
        map: {
          ...state.map,
          [action.label.id]: action.label
        },
        all: [...state.all, action.label.id],
        [action.label.type + 's']: action.label.type === 'subgenre'
          ? {
            ...state[action.label.type + 's'],
            [+action.label.parent_id]: [
              ...state[action.label.type + 's'][+action.label.parent_id],
              action.label.id
            ]
          }
          : [...state[action.label.type + 's'], action.label.id]
      }
    default:
      return state;
  }
}