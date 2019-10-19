import {
  FETCH_TRACKS,
  TRACKS_SEARCH,
  MODIFY_TRACK_SELECTION,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  FILTER_BY_PLAYLIST,
  UPDATE_TRACKS_LABELS,
} from '../actions/types';

const initialState = {
  map: {},
  all: [],
  filtered: [],
  searchFiltered: [],
  selected: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRACKS:
      return {
        ...state,
        map: action.map,
        all: action.ids,
        filtered: action.ids
      }
    case FILTER_BY_PLAYLIST:
      return {
        ...state,
        filtered: state.all.filter(id => 
          state.map[id].playlist_ids.some(id => 
            action.filter[id]
          )
        )
      }
    case TRACKS_SEARCH:
      return {
        ...state,
        searchFiltered: state.filtered.filter(id => {
          const { name, artist, album } = state.map[id];
          const filter = action.payload.toLowerCase();
          return (
            name.toLowerCase().includes(filter)
            || artist.toLowerCase().includes(filter)
            || album.name.toLowerCase().includes(filter)
          );
        }), 
      }
    case MODIFY_TRACK_SELECTION:
      return {
        ...state,
        selected: {
          ...state.selected,
          [action.payload]: !state.selected[action.payload]
        }
      }
    case SELECT_ALL_TRACKS:
      return {
        ...state,
        selected: state.searchFiltered.reduce((obj, id) => ({
          ...obj,
          [id]: true,
        }), {})
      }    
    case DESELECT_ALL_TRACKS:
      return {
        ...state,
        selected: {}
      }
    //TODO
    case UPDATE_TRACKS_LABELS:
      return {
        ...state,
        map: {
          ...state.map,
          ...Object.keys(state.selected)
            .filter(id => state.selected[id])
            .reduce((obj, id) => ({
              ...obj,
              [id]: {
                ...state.map[id],
                label_ids: [
                  ...state.map[id].label_ids.filter(id => !action.labelIds.includes(id)),
                  ...action.addLabels ? action.labelIds : []
                ]
              }
            }), {})
        }
      }
    default:
      return state;
  }
}