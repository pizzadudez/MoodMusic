import _ from 'lodash';
import {
  MODIFY_PLAYLIST_FILTER,
  PLAYLIST_FILTER_ALL,
  FILTER_BY_LABEL,
  PLAYLIST_FILTER_LIKED,
  FILTER_BY_PLAYLIST,
} from './types';

// Playlist Filter
export const filterByPlaylist = id => (dispatch, getState) => {
  dispatch({
    type: MODIFY_PLAYLIST_FILTER,
    id: id,
  });
  dispatch({
    type: FILTER_BY_PLAYLIST,
    tracksById: getState().tracks.tracksById,
    tracks: getState().tracks.ids,
  });
};
export const showAll = () => (dispatch, getState) => {
  dispatch({
    type: PLAYLIST_FILTER_ALL,
    tracks: getState().tracks.ids,
  });
  dispatch({
    type: FILTER_BY_LABEL,
    tracksById: getState().tracks.tracksById,
    tracks: getState().tracks.ids,
  });
};
export const showLiked = () => (dispatch, getState) => {
  dispatch({
    type: PLAYLIST_FILTER_LIKED,
    liked: Object.keys(_.pickBy(getState().tracks.liked)),
  });
  dispatch({
    type: FILTER_BY_LABEL,
    tracksById: getState().tracks.tracksById,
    tracks: getState().tracks.ids,
  });
};
