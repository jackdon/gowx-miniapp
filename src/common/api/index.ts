/* eslint-disable import/prefer-default-export */
import qs from "qs";
import Taro from "@tarojs/taro";

export const API_ROOT =
  process.env.NODE_ENV === "development"
    ? "http://119.78.163.199:8080"
    : "https://goexa.qiiso.com";

export const WS_ROOT =
process.env.NODE_ENV === "development"
  ? "ws://127.0.0.1:8080"
  : "wss://goexa.qiiso.com";

function isRespOk(res) {
  return res && res.statusCode == 200 && res.data;
}

export function restExamplePage({ page, pageSize }) {
  return Taro.request({
    method: "GET",
    retryTimes: 3,
    url: `${API_ROOT}/example/page?${qs.stringify({ page: page, pageSize })}`
  })
    .then(res => {
      if (isRespOk(res)) {
        return Promise.resolve(res.data);
      }
      return Promise.reject();
    })
    .catch(err => Promise.reject(err));
}

export function restExmapleDetail({ id, comment }) {
  return Taro.request({
    method: "POST",
    retryTimes: 3,
    url: `${API_ROOT}/example/detail/${id}?${qs.stringify({ comment })}`
  })
    .then(res => {
      if (isRespOk(res)) {
        return Promise.resolve(res.data);
      }
      return Promise.reject();
    })
    .catch(err => Promise.reject(err));
}

export function restSubmitFeedback({ content }) {
  return Taro.request({
    method: "POST",
    url: `${API_ROOT}/feedback`,
    data: { content },
    timeout: 2000,
    retryTimes: 3
  })
    .then(res => {
      if (isRespOk(res)) {
        return Promise.resolve(res.data);
      }
      return Promise.reject(res);
    })
    .catch(err => Promise.reject(err));
}

export function restSandboxList() {
  return Taro.request({
    method: "POST",
    url: `${API_ROOT}/sandbox/list`,
    timeout: 2000,
    retryTimes: 3
  })
    .then(res => {
      if (isRespOk(res)) {
        return Promise.resolve(res.data);
      }
      return Promise.reject(res);
    })
    .catch(err => Promise.reject(err));
}

export function restLessonPaging({ category, page, pageSize }) {
  return Taro.request({
    method: "POST",
    url: `${API_ROOT}/sandbox/lesson/page?${qs.stringify({
      category,
      page,
      pageSize
    })}`,
    timeout: 2000,
    retryTimes: 3
  })
    .then(res => {
      if (isRespOk(res)) {
        return Promise.resolve(res.data);
      }
      return Promise.reject(res);
    })
    .catch(err => Promise.reject(err));
}

export function restSectionPaging({ id, page, pageSize }) {
  return Taro.request({
    method: "POST",
    url: `${API_ROOT}/sandbox/section/page/${id}?${qs.stringify({
      page,
      pageSize
    })}`,
    timeout: 2000,
    retryTimes: 3
  })
    .then(res => {
      if (isRespOk(res)) {
        return Promise.resolve(res.data);
      }
      return Promise.reject(res);
    })
    .catch(err => Promise.reject(err));
}

export function restSectionDetail({ id }) {
  return Taro.request({
    method: "POST",
    url: `${API_ROOT}/sandbox/section/detail/${id}`,
    retryTimes: 3
  })
    .then(res => {
      if (isRespOk(res)) {
        return Promise.resolve(res.data);
      }
      return Promise.reject();
    })
    .catch(err => Promise.reject(err));
}
