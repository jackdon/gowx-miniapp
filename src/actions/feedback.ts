import {
  SUBMIT_FEEDBACK,
  SUBMIT_FEEDBACK_FAIL,
  SUBMIT_FEEDBACK_SUCCESS,
  TOGGLE_FEEDBACK_CHANGE
} from "../constants/feedback";
import { restSubmitFeedback } from "../common/api";

export const submitFeedbackStart = () => {
  return {
    type: SUBMIT_FEEDBACK
  };
};
export const submitFeedbackFail = error => {
  return {
    type: SUBMIT_FEEDBACK_FAIL,
    error
  };
};

export const submitFeedbackSuccess = data => {
  return {
    type: SUBMIT_FEEDBACK_SUCCESS,
    payload: data
  };
};

// 异步的action
export function submitFeedback(cb: Function) {
  return (dispatch, getState) => {
    const { content } = getState().feedback;
    dispatch(submitFeedbackStart());
    restSubmitFeedback({ content })
      .then(data => {
        dispatch(submitFeedbackSuccess(data));
        if (cb && typeof cb === "function") cb();
      })
      .catch(err => {
        dispatch(submitFeedbackFail(err))
        if (cb && typeof cb === "function") cb(err);
      });
  };
}

export function toggleContentChange(content: string) {
  return { type: TOGGLE_FEEDBACK_CHANGE, payload: content };
}
