import {
  FETCH_PLAYLISTS,
  CREATE_PLAYLIST,
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
    case CREATE_PLAYLIST:
      return {
        ...state,
        map: {
          ...state.map,
          [action.playlist.id]: action.playlist
        },
        all: [...state.all, action.playlist.id],
        custom: [...state.custom, action.playlist.id]
      }
    default: 
      return state;
  }
}