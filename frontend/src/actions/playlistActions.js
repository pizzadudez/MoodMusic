import axios from 'axios';
import {
  MODIFY_PLAYLIST_FIELD,
  CREATE_PLAYLIST,
} from './types';

export const modifyPlaylistField = (id, field, value) => dispatch => {
  dispatch({
    type: MODIFY_PLAYLIST_FIELD,
    id,
    field,
    value
  });
};
export const createPlaylist = json => dispatch => {
  axios.post('/api/playlists', json).then(res => {
    dispatch({
      type: CREATE_PLAYLIST,
      playlist: res.data.playlist,
    });
  }).catch(err => console.log(err));
}