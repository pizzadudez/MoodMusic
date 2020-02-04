import {
  FETCH_TRACKS,
  PLAYLIST_FILTER_LIKED,
  PLAYLIST_FILTER_ALL,
  MODIFY_PLAYLIST_FILTER,
  FILTER_BY_PLAYLIST,
  FILTER_BY_LABEL,
} from '../actions/types';

const initialState = {
  ids: [],
  playlists: {},
  labels: {},
  searchFilter: '',
  filterType: 'all',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRACKS:
      return {
        ...state,
        ids: Object.keys(action.payload),
      };
    case MODIFY_PLAYLIST_FILTER:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.id]: !state.playlists[action.id],
        },
        filterType: 'playlist',
      };
    case PLAYLIST_FILTER_ALL:
      return {
        ...state,
        ids: action.tracks,
        playlists: [],
        filterType: 'all',
      };
    case PLAYLIST_FILTER_LIKED:
      return {
        ...state,
        ids: action.liked,
        playlists: [],
        filterType: 'liked',
      };
    case FILTER_BY_PLAYLIST:
      return filterByPlaylist(state, action);
    case FILTER_BY_LABEL:
      return filterByLabel(state, action);
    default:
      return state;
  }
};

const filterByPlaylist = (state, action) => {
  const { tracksById, tracks } = action;
  const newState = {
    ...state,
    ids: tracks.filter(id =>
      tracksById[id].playlist_ids.some(id => state.playlists[id])
    ),
  };
  return filterByLabel(newState, action);
};
const filterByLabel = (state, action) => {
  return state;
};
