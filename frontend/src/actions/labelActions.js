import axios from 'axios';
import { CREATE_LABEL } from './types';

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
