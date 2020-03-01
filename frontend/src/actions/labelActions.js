import axios from 'axios';
import _ from 'lodash';
import { CREATE_LABEL, UPDATE_LABEL, DELETE_LABEL } from './types';
import { fetchLabels, fetchPlaylists } from './dataActions';

export const createLabel = data => dispatch => {
  const json = _.pickBy(data);
  axios
    .post('/api/labels', json)
    .then(res =>
      dispatch({
        type: CREATE_LABEL,
        label: res.data,
      })
    )
    .catch(err => console.log(err));
};
export const updateLabel = (id, data) => dispatch => {
  const json = _.pickBy(data);
  axios
    .patch('/api/label/' + id, json)
    .then(res => {
      if (json.parent_id && json.type === 'subgenre') {
        dispatch(fetchLabels());
      } else {
        dispatch({
          type: UPDATE_LABEL,
          label: res.data,
        });
      }
    })
    .catch(err => console.log(err));
};
export const deleteLabel = id => (dispatch, getState) => {
  const { parent_id, subgenre_ids, playlist_id } = getState().labels.labelsById[
    id
  ];
  axios
    .delete('/api/label/' + id)
    .then(() => {
      if (parent_id || subgenre_ids) {
        dispatch(fetchLabels());
        dispatch(fetchPlaylists());
      } else {
        dispatch({ type: DELETE_LABEL, id });
        if (playlist_id) {
          dispatch(fetchPlaylists());
        }
      }
    })
    .catch(err => console.log(err));
};
