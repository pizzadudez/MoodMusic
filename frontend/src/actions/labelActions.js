import axios from 'axios';
import { CREATE_LABEL, UPDATE_LABEL, SELECT_LABEL_TO_UPDATE } from './types';

export const createLabel = json => dispatch => {
  axios
    .post('/api/labels', json)
    .then(res => {
      dispatch({
        type: CREATE_LABEL,
        label: res.data,
      });
    })
    .catch(err => console.log(err));
};
export const updateLabel = (id, json) => dispatch => {
  axios
    .patch('/api/label/' + id, json)
    .then(res => {
      dispatch({
        type: UPDATE_LABEL,
        label: res.data,
      });
    })
    .catch(err => console.log(err));
};
export const selectLabelToUpdate = id => dispatch => {
  dispatch({
    type: SELECT_LABEL_TO_UPDATE,
    id,
  });
};
