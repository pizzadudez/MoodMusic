import {
  FETCH_LABELS,
  CREATE_LABEL,
  UPDATE_LABEL,
  DELETE_LABEL,
} from '../actions/types';

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
        ids: Object.entries(action.payload)
          .sort((a, b) => b[1].track_count - a[1].track_count)
          .map(([key, _]) => parseInt(key)),
      };
    case CREATE_LABEL: {
      const { label } = action;
      // handle subgenres
      let parent;
      if (label.parent_id) {
        parent = { ...state.labelsById[label.parent_id] };
        parent.subgenre_ids = [...(parent.subgenre_ids || []), label.id];
      }

      return {
        ...state,
        ids: [...state.ids, label.id],
        labelsById: {
          ...state.labelsById,
          [label.id]: label,
          ...(label.parent_id && { [label.parent_id]: parent }),
        },
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
    case DELETE_LABEL: {
      const { [action.id]: value, ...rest } = state.labelsById;
      return {
        ...state,
        labelsById: {
          ...rest,
        },
        ids: state.ids.filter(id => id !== action.id),
      };
    }
    default:
      return state;
  }
};
