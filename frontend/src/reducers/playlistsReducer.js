import {
  FETCH_PLAYLISTS,
  CREATE_PLAYLIST,
} from '../actions/types';

const initialState = {
  playlistsById: {},
  ids: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYLISTS:
      return {
        ...state,
        playlistsById: action.payload,
        ids: Object.keys(action.payload)
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