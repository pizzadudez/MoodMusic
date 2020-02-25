import {
  LOADING_FINISHED,
  SET_AUTHORIZED,
  SELECT_LABEL_TO_UPDATE,
  UPDATE_LABEL,
} from '../actions/types';

const initialState = {
  authorized: false,
  loadingData: true,
  updatingLabelId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHORIZED:
      return {
        ...state,
        authorized: action.payload,
      };
    case LOADING_FINISHED:
      return {
        ...state,
        loadingData: false,
      };
    default:
      return state;
  }
};
