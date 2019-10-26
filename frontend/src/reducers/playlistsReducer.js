import {
  FETCH_PLAYLISTS,
  MODIFY_PLAYLIST_FIELD,
  CREATE_PLAYLIST,
  MODIFY_PLAYLIST_SELECTION,
} from '../actions/types';

const initialState = {
  map: {},
  all: [],
  default: [],
  custom: [],
  selected: {},
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
    case MODIFY_PLAYLIST_SELECTION:
      return {
        ...state,
        selected: {
          ...state.selected,
          [action.id]: !state.selected[action.id]
        }
      }
    default: 
      return state;
  }
}