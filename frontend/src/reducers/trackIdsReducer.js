import {
  FETCH_TRACKS,
  TRACKS_SEARCH,
  MODIFY_TRACK_SELECTION,
  SELECT_ALL_TRACKS,
  DESELECT_ALL_TRACKS,
  FILTER_BY_PLAYLIST
} from '../actions/types';

const initialState = {
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
        all: action.ids,
        filtered: action.ids
      }
    case FILTER_BY_PLAYLIST:
      return {
        ...state,
        filtered: state.all.filter(id => 
          action.tracks[id].playlist_ids.some(id => 
            action.filter[id]
          )
        )
      }
    case TRACKS_SEARCH:
      return {
        ...state,
        searchFiltered: state.filtered.filter(id => {
          const { name, artist, album } = action.tracks[id];
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
    default: 
      return state;
  }
}