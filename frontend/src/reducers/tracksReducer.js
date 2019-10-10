import { FETCH_TRACKS } from "../actions/types";

const initialState = {
  trackMap: {},
  trackIds: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRACKS:
      return {
        ...state,
        trackMap: action.map,
        trackIds: action.ids,
      };
    default:
      return state;
  }
}