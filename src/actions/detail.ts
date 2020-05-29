import {
  FETCH_DETAIL,
  FETCH_DETAIL_SUCCESS,
  FETCH_DETAIL_FAIL,
  FETCH_DETAIL_CLEAR,
  TOGGLE_EXAMPLE_SHOW_MODE
} from "../constants/detail";
import { restExmapleDetail } from "../common/api";

export const clearDetail = () => {
  return {
    type: FETCH_DETAIL_CLEAR
  };
};
export const fetchExampleDetailStart = isFirstLoad => {
  return {
    type: FETCH_DETAIL,
    payload: { isFirstLoad }
  };
};
export const fetchExampleDetailFail = error => {
  return {
    type: FETCH_DETAIL_FAIL,
    error
  };
};

export const fetchExampleDetailSuccess = data => {
  return {
    type: FETCH_DETAIL_SUCCESS,
    payload: data
  };
};

// 异步的action
export function fetchExampleDetail(id: string) {
  return dispatch => {
    dispatch(fetchExampleDetailStart(id));
    restExmapleDetail({ id, comment: "on" })
      .then(data => {
        dispatch(fetchExampleDetailSuccess(data));
      })
      .catch(err => dispatch(fetchExampleDetailFail(err)));
  };
}

export function changeExampleShowMode(flag: boolean) {
  return { type: TOGGLE_EXAMPLE_SHOW_MODE, payload: flag };
}
