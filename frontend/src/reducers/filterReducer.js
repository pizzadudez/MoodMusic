import {
  FETCH_TRACKS
} from '../actions/types';

const initialState = {
  ids: [],
  byPlaylists: [],
  byLabels: [],
  playlists: {},
  labels: {},
  searchFilter: '',
  filterType: 'all'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRACKS:
      return {
        ...state,
        ids: Object.keys(action.payload),
        byPlaylists: Object.keys(action.payload),
        byLabels: Object.keys(action.payload),
      }
    default:
      return state;
  }
}