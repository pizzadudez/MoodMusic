import { FETCH_LABELS } from "../actions/types";

const initialState = {
  labels: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_LABELS:
      return {
        ...state,
        labels: action.payload,
      };
    default:
      return state;
  }
}