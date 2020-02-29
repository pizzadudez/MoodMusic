import axios from 'axios';
import _ from 'lodash';
import { CREATE_LABEL, UPDATE_LABEL, DELETE_LABEL } from './types';

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
    .then(res =>
      dispatch({
        type: UPDATE_LABEL,
        label: res.data,
      })
    )
    .catch(err => console.log(err));
};
export const deleteLabel = id => dispatch => {
  axios
    .delete('/api/label/' + id)
    .then(() => dispatch({ type: DELETE_LABEL, id }))
    .catch(err => console.log(err));
};
