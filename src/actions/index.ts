import Taro from "@tarojs/taro";
import qs from "querystring";
import {
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAIL,
  FETCH_LIST_CLEAR
} from "../constants/index";

export const clearList = () => {
  return {
    type: FETCH_LIST_CLEAR
  };
};
export const fetchExampleListStart = isFirstLoad => {
  return {
    type: FETCH_LIST,
    payload: { isFirstLoad }
  };
};
export const fetchExampleListFail = error => {
  return {
    type: FETCH_LIST_FAIL,
    error
  };
};

export const fetchExampleListSuccess = data => {
  return {
    type: FETCH_LIST_SUCCESS,
    payload: data
  };
};

// 异步的action
export function fetchExampleList(isFirstLoad: boolean) {
  return (dispatch, getState) => {
    const store = getState();
    const { page = 0, perPage = 15 } = isFirstLoad
      ? {}
      : store.pageIndex.pagination || {};
    dispatch(fetchExampleListStart(isFirstLoad));
    Taro.request({
      method: "GET",
      url:
        "https://goexa.qiiso.com/example/page?" +
        qs.stringify({ page: page + 1, pageSize: perPage })
    })
      .then(res => {
        if (res && res.statusCode == 200 && res.data) {
          dispatch(fetchExampleListSuccess(res.data));
        }
      })
      .catch(err => dispatch(fetchExampleListFail(err)));
  };
}
