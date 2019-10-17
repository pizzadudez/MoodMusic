import { 
  FETCH_LABELS 
} from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_LABELS:
      return {
        ...state,
        ...action.map
      };
    default:
      return state;
  }
}