import {
  LOADING_FINISHED,
  CONFIRM_ACTION_START,
  CONFIRM_ACTION_SUCCESS,
  CONFIRM_ACTION_CANCEL,
  SET_AUTHENTICATED,
} from '../actions/types';

const initialState = {
  authenticated: false,
  loadingData: true,
  confirmation: {
    pending: false,
    status: false,
    title: '',
    description: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: action.payload,
      };
    case LOADING_FINISHED:
      return {
        ...state,
        loadingData: false,
      };
    case CONFIRM_ACTION_START:
      return {
        ...state,
        confirmation: {
          pending: true,
          status: false,
          title: action.options.title,
          description: action.options.description,
        },
      };
    case CONFIRM_ACTION_SUCCESS:
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          pending: false,
          status: true,
        },
      };
    case CONFIRM_ACTION_CANCEL:
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          pending: false,
          status: false,
        },
      };
    default:
      return state;
  }
};
