import axios from 'axios';
import { MODIFY_PLAYLIST_FIELD } from './types';

export const modifyPlaylistField = (id, field, value) => dispatch => {
  dispatch({
    type: MODIFY_PLAYLIST_FIELD,
    id,
    field,
    value
  });
};