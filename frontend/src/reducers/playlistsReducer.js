import { FETCH_PLAYLISTS } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_PLAYLISTS:
      return {
        ...state,
        ...action.map,
      };
    default: 
      return state;
  }
}