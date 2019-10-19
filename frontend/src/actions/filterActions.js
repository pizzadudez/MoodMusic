import {
  MODIFY_PLAYLIST_FILTER,
  FILTER_BY_PLAYLIST,
} from './types';

export const filterByPlaylist = id => (dispatch, getState) => {
  dispatch({
    type: MODIFY_PLAYLIST_FILTER,
    payload: id,
  });
  dispatch({
    type: FILTER_BY_PLAYLIST,
    filter: getState().playlists.filter,
  });
};

// const filterByLabel

// const filterBySearch

// const filterByRating