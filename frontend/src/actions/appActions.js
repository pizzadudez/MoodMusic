import {
  CONFIRM_ACTION_START,
  CONFIRM_ACTION_SUCCESS,
  CONFIRM_ACTION_CANCEL,
} from './types';
import store from '../store';

export const confirm = options => (dispatch, getState) => {
  const { title, description } = options;
  dispatch({
    type: CONFIRM_ACTION_START,
    options: {
      title: title || '',
      description: description || '',
    },
  });

  return new Promise((resolve, reject) => {
    const listener = () => {
      const { pending, status } = getState().app.confirmation;
      if (!pending) {
        status ? resolve() : reject();
        unsubscribe();
      }
    };
    const unsubscribe = store.subscribe(listener);
  });
};
export const confirmAction = () => dispatch => {
  dispatch({ type: CONFIRM_ACTION_SUCCESS });
};
export const cancelAction = () => dispatch => {
  dispatch({ type: CONFIRM_ACTION_CANCEL });
};
