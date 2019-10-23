import {
  MODIFY_PLAYLIST_FILTER,
  FILTER_BY_PLAYLIST,
  MODIFY_LABEL_FILTER,
  FILTER_BY_LABEL,
} from './types';

export const filterByPlaylist = id => (dispatch, getState) => {
  dispatch({
    type: MODIFY_PLAYLIST_FILTER,
    payload: id,
  });
  dispatch({
    type: FILTER_BY_LABEL,
    playlistFilter: getState().playlists.filter,
    labelFilter: getState().labels.filter,
  });
};

export const filterByLabel = id => (dispatch, getState) => {
  dispatch({
    type: MODIFY_LABEL_FILTER,
    payload: id,
  })
  dispatch({
    type: FILTER_BY_LABEL,
    playlistFilter: getState().playlists.filter,
    labelFilter: getState().labels.filter,
  })
}

// const filterBySearch

// const filterByRating