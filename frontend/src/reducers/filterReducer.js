import _ from 'lodash';
import {
  FETCH_TRACKS,
  PLAYLIST_FILTER_LIKED,
  PLAYLIST_FILTER_ALL,
  MODIFY_PLAYLIST_FILTER,
  FILTER_BY_PLAYLIST,
  FILTER_BY_LABEL,
  MODIFY_LABEL_FILTER,
  REMOVE_LABEL_FILTER,
} from '../actions/types';

const initialState = {
  ids: [],
  byPlaylists: [],
  playlists: {},
  labels: {},
  filterType: 'all',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRACKS:
      return {
        ...state,
        ids: Object.keys(action.payload),
        byPlaylists: Object.keys(action.payload),
        filterType: 'all',
      };
    case PLAYLIST_FILTER_ALL:
      return {
        ...state,
        ids: action.tracks,
        byPlaylists: action.tracks,
        playlists: {},
        filterType: 'all',
      };
    case PLAYLIST_FILTER_LIKED:
      return {
        ...state,
        ids: action.liked,
        byPlaylists: action.liked,
        playlists: {},
        filterType: 'liked',
      };
    case REMOVE_LABEL_FILTER:
      return {
        ...state,
        ids: state.byPlaylists,
        labels: {},
      };
    case FILTER_BY_PLAYLIST:
      return filterByPlaylist(state, action);
    case FILTER_BY_LABEL:
      return filterByLabel(state, action);
    case MODIFY_PLAYLIST_FILTER:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.id]: !state.playlists[action.id],
        },
        filterType: 'playlist',
      };
    case MODIFY_LABEL_FILTER: {
      const { labels } = state;
      const { id, subgenreIds } = action;

      let newValue = undefined;
      if (labels[id] === true) newValue = false;
      else if (labels[id] === undefined) newValue = true;
      const changeIds = Object.fromEntries(
        [id, ...subgenreIds].map(id => [id, true])
      );

      return {
        ...state,
        labels: {
          ...Object.fromEntries(
            Object.keys(labels)
              .filter(id => !changeIds[id])
              .map(id => [id, labels[id]])
          ),
          ...(newValue !== undefined &&
            Object.fromEntries(
              Object.keys(changeIds).map(id => [id, newValue])
            )),
        },
      };
    }
    default:
      return state;
  }
};

const filterByPlaylist = (state, action) => {
  const { tracksById, tracks } = action;
  const filtered = tracks.filter(id =>
    tracksById[id].playlist_ids.some(id => state.playlists[id])
  );
  const newState = {
    ...state,
    ids: filtered,
    byPlaylists: filtered,
  };
  return filterByLabel(newState, action);
};
const filterByLabel = (state, action) => {
  const { labels, byPlaylists } = state;
  if (_.isEmpty(labels)) {
    return {
      ...state,
      ids: byPlaylists,
    };
  }

  const { tracksById } = action;
  let filtered = [];
  const inclusiveOnly = !Object.values(labels).some(val => !val);
  const exclusiveOnly = !Object.values(labels).some(val => val);
  if (inclusiveOnly || exclusiveOnly) {
    filtered = byPlaylists.filter(id => {
      const trackLabels = tracksById[id].label_ids;
      return exclusiveOnly
        ? !trackLabels.some(id => labels[id] === false)
        : trackLabels.some(id => labels[id] === true);
    });
  } else {
    filtered = byPlaylists.filter(id => {
      let includes = false;
      let excludes = false;
      const trackLabels = tracksById[id].label_ids;
      for (let i = 0; i < trackLabels.length; i++) {
        if (labels[trackLabels[i]] === false) {
          excludes = true;
          break;
        } else if (labels[trackLabels[i]] === true) {
          includes = true;
        }
      }
      return includes && !excludes;
    });
  }

  return {
    ...state,
    ids: filtered,
  };
};
