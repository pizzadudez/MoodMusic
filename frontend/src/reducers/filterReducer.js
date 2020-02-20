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
  labels: {
    include: {},
    exclude: {},
  },
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
        labels: {
          include: {},
          exclude: {},
        },
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
      const { include, exclude } = state.labels;
      const { operation, id, subgenreIds } = action;

      const includeVal =
        operation === 'include' ? (include[id] ? false : true) : false;
      const excludeVal =
        operation === 'exclude' ? (exclude[id] ? false : true) : false;

      return {
        ...state,
        labels: {
          include: {
            ...include,
            ...Object.fromEntries(
              [id, ...subgenreIds].map(id => [id, includeVal])
            ),
          },
          exclude: {
            ...exclude,
            ...Object.fromEntries(
              [id, ...subgenreIds].map(id => [id, excludeVal])
            ),
          },
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
  const {
    labels: { include, exclude },
    byPlaylists,
  } = state;
  const includeIsEmpty = _.isEmpty(_.pickBy(include));
  const excludeIsEmpty = _.isEmpty(_.pickBy(exclude));
  const includeOnly = !includeIsEmpty && excludeIsEmpty;
  const excludeOnly = !excludeIsEmpty && includeIsEmpty;

  if (includeIsEmpty && excludeIsEmpty) {
    return {
      ...state,
      ids: byPlaylists,
    };
  }

  const { tracksById } = action;
  let filtered = [];
  if (includeOnly || excludeOnly) {
    filtered = byPlaylists.filter(id => {
      const trackLabels = tracksById[id].label_ids;
      return includeOnly
        ? trackLabels.some(id => include[id])
        : !trackLabels.some(id => exclude[id]);
    });
  } else {
    filtered = byPlaylists.filter(id => {
      let includes = false;
      let excludes = false;
      const trackLabels = tracksById[id].label_ids;
      for (let i = 0; i < trackLabels.length; i++) {
        if (exclude[trackLabels[i]]) {
          excludes = true;
          break;
        } else if (include[trackLabels[i]]) {
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
