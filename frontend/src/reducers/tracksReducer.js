import {
  FETCH_TRACKS,
  TRACKS_SEARCH,
  SELECT_TRACK,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  ADD_LABELS
} from "../actions/types";

const initialState = {
  trackMap: {},
  trackIds: [],
  trackIdsSearch: [],
  trackIdsSelected: {},
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
    case SELECT_TRACK:
      return {
        ...state,
        trackIdsSelected: {
          ...state.trackIdsSelected,
          [action.payload]: !state.trackIdsSelected[action.payload]
        }
      }
    case SELECT_ALL_TRACKS:
      return {
        ...state,
        trackIdsSelected: state.trackIdsSearch.reduce((obj, id) => ({
          ...obj,
          [id] : true,
        }), {})
      }
    case DESELECT_ALL_TRACKS:
      return {
        ...state,
        trackIdsSelected: {}
      }
    case ADD_LABELS: {
      return {
        ...state,
        trackMap: trackMap(state.trackMap, action)
      };
    }
    default:
      return state;
  }
}

const trackMap = (state, action) => {
  switch(action.type) {
    case ADD_LABELS:
      return {
        ...state,
        ...action.payload.reduce((obj, { track_id, label_ids }) => {
          obj[track_id] = {
            ...state[track_id],
            label_ids: [...new Set([...state[track_id].label_ids, ... label_ids])]
          }
          return obj;
        }, {})
      };
    default:
      return state;
  }
}