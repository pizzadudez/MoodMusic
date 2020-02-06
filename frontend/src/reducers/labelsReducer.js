import { FETCH_LABELS, CREATE_LABEL, UPDATE_LABEL } from '../actions/types';

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
        ids: Object.keys(action.payload),
      };
    case CREATE_LABEL:
      return {
        ...state,
        labelsById: {
          ...state.labelsById,
          [action.label.id]: action.label,
          ...(action.label.parent_id && {
            [action.label.parent_id]: {
              ...state.labelsById[action.label.parent_id],
              subgenre_ids: [
                ...(state.labelsById[action.label.parent_id].subgenre_ids ||
                  []),
                action.label.id,
              ],
            },
          }),
        },
        ids: [...state.ids, action.label.id],
      };
    case UPDATE_LABEL:
      return {
        ...state,
        labelsById: {
          ...state.labelsById,
          [action.label.id]: action.label,
        },
      };
    default:
      return state;
  }
};
