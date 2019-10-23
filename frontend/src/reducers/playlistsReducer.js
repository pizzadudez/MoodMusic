import {
  FETCH_PLAYLISTS,
} from '../actions/types';

const initialState = {
  map: {},
  all: [],
  default: [],
  custom: [],
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYLISTS:
      return {
        ...state,
        map: action.map,
        all: action.ids,
        default: action.types.default,
        custom: action.types.custom,
        filter: action.ids.reduce((obj, id) => ({
          ...obj,
          [id]: true,
        }), {})
      }
    default: 
      return state;
  }
}