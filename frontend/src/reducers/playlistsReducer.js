import {
  FETCH_PLAYLISTS, MODIFY_PLAYLIST_FIELD,
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
      }
    case MODIFY_PLAYLIST_FIELD:
      return {
        ...state,
        map: {
          ...state.map,
          [action.id]: {
            ...state.map[action.id],
            [action.field] : action.value,
          }
        }
      }
    default: 
      return state;
  }
}