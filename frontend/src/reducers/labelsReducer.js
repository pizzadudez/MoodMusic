import {
  FETCH_LABELS,
} from "../actions/types";

const initialState = {
  labelsById: {},
  ids: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LABELS:
      return {
        ...state,
        labelsById: action.payload,
        ids: Object.keys(action.payload)
      }
    default:
      return state;
  }
}