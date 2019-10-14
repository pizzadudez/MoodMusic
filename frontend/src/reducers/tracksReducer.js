import { FETCH_TRACKS, TRACKS_SEARCH } from "../actions/types";

const initialState = {
  trackMap: {},
  trackIds: [],
  trackIdsSearch: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRACKS:
      return {
        ...state,
        trackMap: action.map,
        trackIds: action.ids,
      };
    case TRACKS_SEARCH:
      return {
        ...state,
        trackIdsSearch: state.trackIds.filter(id => 
          state.trackMap[id].name.toLowerCase().indexOf(action.payload.toLowerCase()) !== -1
        ),
      }
    default:
      return state;
  }
}