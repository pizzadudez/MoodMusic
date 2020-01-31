import {
  FETCH_LABELS,
  CREATE_LABEL,
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
    // case CREATE_LABEL:
    //   return {
    //     ...state,
    //     map: {
    //       ...state.map,
    //       [action.label.id]: action.label
    //     },
    //     all: [...state.all, action.label.id],
    //     [action.label.type + 's']: action.label.type === 'subgenre'
    //       ? {
    //         ...state[action.label.type + 's'],
    //         [+action.label.parent_id]: [
    //           ...state[action.label.type + 's'][+action.label.parent_id],
    //           action.label.id
    //         ]
    //       }
    //       : [...state[action.label.type + 's'], action.label.id]
    //   }
    default:
      return state;
  }
}