import {
  LOADING_FINISHED,
  LOADING_STARTED,
  SET_AUTHORIZED,
} from "../actions/types";

const initialState = {
  authorized: false,
  loadingFinished: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHORIZED:
      return {
        ...state,
        authorized: action.payload
      }
    case LOADING_FINISHED:
      return {
        ...state,
        loadingFinished: true,
      }
    case LOADING_STARTED:
      return {
        ...state,
        loadingFinished: false,
      }
    default:
      return state;
  }
}