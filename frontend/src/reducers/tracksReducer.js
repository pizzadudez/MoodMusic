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
      const trackMap = { ...state.trackMap };
      const updatedTracks = action.payload.reduce((obj, { track_id, label_ids }) => {
        const labelIds = label_ids.map(id => parseInt(id));
        obj[track_id] = {
          ...trackMap[track_id],
          label_ids: [...new Set([...trackMap[track_id].label_ids, ... labelIds])]
        }
        return obj;
      }, {})

      return {
        ...state,
        trackMap: {
          ...trackMap,
          ...updatedTracks,
        }
      };
    }
    default:
      return state;
  }
}