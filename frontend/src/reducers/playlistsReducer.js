import {
  FETCH_PLAYLISTS,
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
    default: 
      return state;
  }
}