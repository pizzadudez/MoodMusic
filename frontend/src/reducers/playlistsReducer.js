import { FETCH_PLAYLISTS } from "../actions/types";

const initialState = {
  playlists: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLAYLISTS:
      return {
        ...state,
        playlists: action.payload,
      };
    default: 
      return state;
  }
}