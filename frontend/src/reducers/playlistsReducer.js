import {
  FETCH_PLAYLISTS,
  MODIFY_PLAYLIST_FILTER,
} from '../actions/types';

const initialState = {
  map: {},
  all: [],
  default: [],
  custom: [],
  filter: {},
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
    case MODIFY_PLAYLIST_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload]: !state.filter[action.payload]
        }
      } 
    default: 
      return state;
  }
}