import axios from 'axios';
import { parsePlaylists, parseTracks } from './dataActions';
import {
  MODIFY_PLAYLIST_FIELD,
  CREATE_PLAYLIST,
  FETCH_PLAYLISTS,
  FETCH_TRACKS,
  CLEAR_PLAYLIST_CHANGES,
} from './types';

export const createPlaylist = json => dispatch => {
  axios.post('/api/playlists', json).then(res => {
    dispatch({
      type: CREATE_PLAYLIST,
      playlist: res.data.playlist,
    });
  }).catch(err => console.log(err));
};
export const modifyPlaylistField = (id, field, value) => dispatch => {
  dispatch({
    type: MODIFY_PLAYLIST_FIELD,
    id,
    field,
    value
  });
};
export const submitPlaylistChanges = () => (dispatch, getState) => {
  const changesMap = getState().changes.playlists;
  const json = Object.keys(changesMap).map(id => ({
    playlist_id: id,
    ...changesMap[id]
  }));
  axios.patch('/api/playlists', json).then(res => {
    if (res.data.playlists) {
      const { map, ids, types } = parsePlaylists(res.data.playlists);
      dispatch({ type: FETCH_PLAYLISTS, map, ids, types });
    }
    if (res.data.tracks) {
      const { map, ids } = parseTracks(res.data.tracks);
      dispatch({ type: FETCH_TRACKS, map, ids });
    }
    dispatch({ type: CLEAR_PLAYLIST_CHANGES });
  });
};
