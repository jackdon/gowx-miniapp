import {
  SUBMIT_FEEDBACK,
  SUBMIT_FEEDBACK_FAIL,
  SUBMIT_FEEDBACK_SUCCESS,
  TOGGLE_FEEDBACK_CHANGE
} from "../constants/feedback";

const INITIAL_STATE = {
  loading: false,
  content: "",
  data: {},
};

function submitSuccess(state, data) {
  return {
    ...state,
    data
  };
}

export default function feedback(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SUBMIT_FEEDBACK:
      return {
        loading: true,
        data: {}
      };
    case SUBMIT_FEEDBACK_SUCCESS:
      return submitSuccess(state, action.payload.data);
    case SUBMIT_FEEDBACK_FAIL:
      return {
        ...state,
        data: {}
      };
    case TOGGLE_FEEDBACK_CHANGE:
      return {
        ...state,
        content: action.payload
      };
    default:
      return state;
  }
}
