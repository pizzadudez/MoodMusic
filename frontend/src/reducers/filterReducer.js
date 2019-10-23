import {
  MODIFY_PLAYLIST_FILTER,
  SELECT_ALL_PLAYLIST_FILTERS,
  DESELECT_ALL_PLAYLIST_FILTERS,
  MODIFY_LABEL_FILTER,
  DESELECT_ALL_LABEL_FILTERS,
  MODIFY_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  FILTER_BY_PLAYLIST,
  FILTER_BY_LABEL,
  FILTER_BY_SEARCH,
  FETCH_TRACKS,
  FETCH_PLAYLISTS,
} from '../actions/types';
import { isEmpty } from 'lodash';

const initialState = {
  tracks: [],
  byPlaylists: [],
  byLabels: [],
  playlists: {},
  labels: {},
  searchFilter: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    // Initial Load
    case FETCH_TRACKS: 
      return {
        ...state,
        tracks: action.ids,
        byPlaylists: action.ids,
        byLabels: action.ids,
      }
    case FETCH_PLAYLISTS:
      return {
        ...state,
        playlists: action.ids.reduce((obj, id) => ({ ...obj, [id]: true, }), {})
      }
    // Playlist changes
    case MODIFY_PLAYLIST_FILTER:
      return modifyPlaylistFilter(state, action);
    case SELECT_ALL_PLAYLIST_FILTERS:
      return {
        ...state,
        tracks: action.tracks.all,
        byPlaylists: action.tracks.all,
        playlists: action.ids.reduce((obj, id) => ({ ...obj, [id]: true, }), {})
      }
    case DESELECT_ALL_PLAYLIST_FILTERS:
      return {
        ...state,
        tracks: [],
        byPlaylists: [],
        byLabels: [],
        playlists: {}
      }
    // Label Changes
    case MODIFY_LABEL_FILTER:
      return modifyLabelFilter(state, action);
    case DESELECT_ALL_LABEL_FILTERS:
      return {
        ...state,
        labels: {}
      }
    // Search Changes
    case MODIFY_SEARCH_FILTER:
      return {
        ...state,
        searchFilter: action.filter
      }
    case REMOVE_SEARCH_FILTER:
      return {
        ...state,
        searchFilter: ''
      }
    // Filtering
    case FILTER_BY_PLAYLIST:
      return filterByPlaylist(state, action);
    case FILTER_BY_LABEL:
      return filterByLabel(state, action);
    case FILTER_BY_SEARCH:
      return filterBySearch(state, action);
    default: 
      return state;
  }
}

const modifyPlaylistFilter = (state, action) => {
  const { [action.id]: value, ...rest } = state.playlists;
  return {
    ...state,
    playlists: {
      ...rest,
      ...!value && { [action.id]: true },
    }
  }
};
const modifyLabelFilter = (state, action) => {
  const { id, subgenreIds } = action;
  const { labels } = state;
  const value = labels[id];
  
  [id, ...subgenreIds || []].forEach(id => {
    if (value === false) {
      delete labels[id];
    } else if (value === undefined) {
      labels[id] = true;
    } else if (value === true) {
      labels[id] = false;
    }
  });

  return {
    ...state,
    labels: { ...labels }
  }
}

const filterByPlaylist = (state, action) => {
  const { tracks } = action;
  const filtered = tracks.all.filter(id => 
    tracks.map[id].playlist_ids.some(id => state.playlists[id])
  )
  const newState = {
    ...state,
    tracks: filtered,
    byPlaylists: filtered,
  };
  return filterByLabel(newState, action);
};
const filterByLabel = (state, action) => {
  if (isEmpty(state.labels)) {
    const newState = {
      ...state,
      tracks: state.byPlaylists,
      byLabels: state.byPlaylists,
    };
    return filterBySearch(newState, action);
  }
  
  const { tracks } = action;
  let filtered = [];
  // Inclusive / Exclusive only filters get applied differently
  const inclusiveOnly = Object.values(state.labels).every(val => val === true);
  const exclusiveOnly = Object.values(state.labels).every(val => val === false);

  if (inclusiveOnly || exclusiveOnly) {
    filtered = state.byPlaylists.filter(id => {
      const labels = tracks.map[id].label_ids;
      return exclusiveOnly 
        ? !labels.some(id => state.labels[id] === false)
        : labels.some(id => state.labels[id] === true)
    });
  } else {
    filtered = state.byPlaylists.filter(id => {
      let includes = false;
      let excludes = false;
      const labels = tracks.map[id].label_ids;
      for (let i = 0; i < labels.length; i++) {
        if (state.labels[labels[i]] === false) {
          excludes = true;
          break;
        } else if (state.labels[labels[i]] === true) {
          includes = true;
        }
      }
      return includes && !excludes;
    });
  }

  const newState = {
    ...state,
    tracks: filtered,
    byLabels: filtered,
  };
  return filterBySearch(newState, action);
};
const filterBySearch = (state, action) => {
  if (!state.searchFilter) {
    return {
      ...state,
      tracks: state.byLabels,
    };
  }
  const { tracks } = action;
  const filtered = state.byLabels.filter(id => {
    const { name, artist, album } = tracks.map[id];
    return [name, artist, album.name].some(el => 
      el.toLowerCase().includes(state.searchFilter.toLowerCase())
    );
  });
  return {
    ...state,
    tracks: filtered,
  };
};