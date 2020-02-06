import axios from 'axios';
import { CREATE_LABEL, UPDATE_LABEL } from './types';

export const createLabel = json => dispatch => {
  axios
    .post('/api/labels', json)
    .then(res => {
      dispatch({
        type: CREATE_LABEL,
        label: res.data.label,
      });
    })
    .catch(err => console.log(err));
};
export const updateLabel = (id, json) => dispatch => {
  axios
    .post('/api/label/' + id, json)
    .then(res => {
      dispatch({
        type: UPDATE_LABEL,
        label: res.data,
      });
    })
    .catch(err => console.log(err));
};
