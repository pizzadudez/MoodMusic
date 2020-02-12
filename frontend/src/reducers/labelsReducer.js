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
    case CREATE_LABEL: {
      const label = action.label;
      let parent = {};
      if (label.parent_id) {
        parent = {
          ...state.labelsById[label.parent_id],
        };
        parent.subgenre_ids = [...(parent.subgenre_ids || []), label.id];
      }
      return {
        ...state,
        labelsById: {
          ...state.labelsById,
          [label.id]: label,
          ...(label.parent_id && { [label.parent_id]: parent }),
        },
        ids: [...state.ids, action.label.id],
      };
    }
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
