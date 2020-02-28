import {
  FETCH_PLAYLISTS,
  CREATE_PLAYLIST,
  UPDATE_PLAYLIST,
} from '../actions/types';

const initialState = {
  playlistsById: {},
  ids: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PLAYLISTS:
      return {
        ...state,
        playlistsById: action.payload,
        ids: Object.keys(action.payload),
      };
    case CREATE_PLAYLIST:
      return {
        ...state,
        playlistsById: {
          ...state.playlistsById,
          [action.playlist.id]: action.playlist,
        },
        ids: [...state.ids, action.playlist.id],
      };
    case UPDATE_PLAYLIST:
      return {
        ...state,
        playlistsById: {
          ...state.playlistsById,
          [action.playlist.id]: action.playlist,
        },
      };
    default:
      return state;
  }
};
