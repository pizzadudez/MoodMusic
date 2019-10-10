import { FETCH_LABELS } from "../actions/types";

const initialState = {
  labelIds: [],
  labelMap: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_LABELS:
      return {
        ...state,
        labelIds: action.ids,
        labelMap: action.map,
      };
    default:
      return state;
  }
}