import {
  MODIFY_PLAYLIST_FILTER,
  MODIFY_LABEL_FILTER,
  SELECT_ALL_PLAYLIST_FILTERS,
  DESELECT_ALL_PLAYLIST_FILTERS,
  DESELECT_ALL_LABEL_FILTERS,
  FILTER_BY_PLAYLIST,
  FILTER_BY_LABEL,
  FILTER_BY_SEARCH,
  MODIFY_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  PLAYLIST_FILTER_ALL,
  PLAYLIST_FILTER_LIKED,
} from './types';

// Playlist
export const filterByPlaylist = id => (dispatch, getState) => {
  dispatch({
    type: MODIFY_PLAYLIST_FILTER,
    id: id,
  });
  dispatch({
    type: FILTER_BY_PLAYLIST,
    tracks: {
      map: getState().tracks.map,
      all: getState().tracks.all,
    }
  });
};
export const showAll = () => (dispatch, getState) => {
  dispatch({
    type: PLAYLIST_FILTER_ALL,
    tracks: {
      all: getState().tracks.all
    }
  });
  dispatch({
    type: FILTER_BY_LABEL,
    tracks: {
      map: getState().tracks.map,
      all: getState().tracks.all,
    }
  });
};
export const showLiked = () => (dispatch, getState) => {
  dispatch({
    type: PLAYLIST_FILTER_LIKED,
    tracks: {
      liked: getState().tracks.liked
    }
  });
  dispatch({
    type: FILTER_BY_LABEL,
    tracks: {
      map: getState().tracks.map,
      all: getState().tracks.all,
    }
  });
};
// export const selectAllPlaylistFilters = () => (dispatch, getState) => {
//   dispatch({
//     type: SELECT_ALL_PLAYLIST_FILTERS,
//     ids: getState().playlists.all,
//     tracks: {
//       all: getState().tracks.all,
//     }
//   });
//   // No playlist filter required => filter next
//   dispatch({
//     type: FILTER_BY_LABEL,
//     tracks: {
//       map: getState().tracks.map,
//       all: getState().tracks.all,
//     }
//   });
// };
// export const deselectAllPlaylistFilters = () => dispatch => {
//   // No filtering required since we have no tracks
//   dispatch({
//     type: DESELECT_ALL_PLAYLIST_FILTERS,
//   });
// };
// Label
export const filterByLabel = id => (dispatch, getState) => {
  const subgenres = getState().labels.subgenres;
  dispatch({
    type: MODIFY_LABEL_FILTER,
    id: id,
    ...subgenres[id] && { subgenreIds: subgenres[id] }
  });
  dispatch({
    type: FILTER_BY_LABEL,
    tracks: {
      map: getState().tracks.map,
    }
  });
};
export const deselectAllLabelFilters = () => (dispatch, getState) => {
  dispatch({
    type: DESELECT_ALL_LABEL_FILTERS,
    ids: getState().labels.all,
  });
  dispatch({
    type: FILTER_BY_LABEL,
    tracks: {
      map: getState().tracks.map,
    }
  });
};
// Search Bar
export const filterBySearch = filter => (dispatch, getState) => {
  dispatch({
    type: MODIFY_SEARCH_FILTER,
    filter
  });
  dispatch({
    type: FILTER_BY_SEARCH,
    tracks: {
      map: getState().tracks.map,
    }
  })
};
export const removeSearchFilter = () => (dispatch, getState) => {
  dispatch({
    type: REMOVE_SEARCH_FILTER,
  });
  dispatch({
    type: FILTER_BY_SEARCH,
    tracks: {
      map: getState().tracks.map,
    }
  })
};


// TODO: filterByRating ????