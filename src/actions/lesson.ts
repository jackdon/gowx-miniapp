import Taro from "@tarojs/taro";
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FETCH_SANDBOX_LIST,
  FETCH_SANDBOX_LIST_CLEAR,
  FETCH_SANDBOX_LIST_FAIL,
  FETCH_SANDBOX_LIST_SUCCESS,
  FETCH_LESSON_PAGINE,
  FETCH_LESSON_PAGINE_SUCCESS,
  FETCH_LESSON_PAGINE_FAIL,
  GALLERY_CHANGE_SELECT,
  FETCH_SECTION_PAGINE,
  FETCH_SECTION_PAGINE_FAIL,
  FETCH_SECTION_PAGINE_SUCCESS,
  TOGGLE_DEBUG_PAGE_INIT,
  FETCH_SECTION_DETAIL,
  FETCH_SECTION_DETAIL_SUCCESS,
  FETCH_SECTION_DETAIL_FAIL,
  TOGGLE_RUNNING_CODE_CHANGE,
  DEBUG_RUNNING_CODE,
  DEBUG_RUNNING_CODE_SUCCESS,
  DEBUG_RUNNING_CODE_FAIL,
  DEBUG_RUNNING_CODE_END,
  DEBUG_RUNNING_CODE_CLEAR,
} from "../constants/lesson";
import {
  restSandboxList,
  restLessonPaging,
  restSectionPaging,
  restSectionDetail,
  WS_ROOT
} from "../common/api";

export const clearList = () => {
  return {
    type: FETCH_SANDBOX_LIST_CLEAR
  };
};
export const fetchSandboxListStart = () => {
  return {
    type: FETCH_SANDBOX_LIST,
    payload: {}
  };
};
export const fetchSandboxListFail = error => {
  return {
    type: FETCH_SANDBOX_LIST_FAIL,
    error
  };
};

export const fetchSandboxListSuccess = data => {
  return {
    type: FETCH_SANDBOX_LIST_SUCCESS,
    payload: data
  };
};

// 异步的action
export function fetchSandboxList() {
  return dispatch => {
    dispatch(fetchSandboxListStart());
    restSandboxList()
      .then(data => {
        dispatch(fetchSandboxListSuccess(data));
      })
      .catch(err => dispatch(fetchSandboxListFail(err)));
  };
}

export const fetchLessonPagingStart = () => {
  return {
    type: FETCH_LESSON_PAGINE,
    payload: {}
  };
};
export const fetchLessonPagingFail = error => {
  return {
    type: FETCH_LESSON_PAGINE_FAIL,
    error
  };
};

export const fetchLessonPagingSuccess = data => {
  return {
    type: FETCH_LESSON_PAGINE_SUCCESS,
    payload: data
  };
};

// 异步的action
export function fetchLessonPaging(_page?: string) {
  return (dispatch, getState) => {
    const store = getState();
    const { category } = store.lesson.gallery || {};
    const { page = 0, perPage = 15 } = store.lesson.gallery.pagination || {};
    dispatch(fetchLessonPagingStart());
    restLessonPaging({ category, page: _page || page + 1, pageSize: perPage })
      .then(data => {
        dispatch(fetchLessonPagingSuccess(data));
      })
      .catch(err => dispatch(fetchLessonPagingFail(err)));
  };
}

export function changeSelectLesson(selectIndex) {
  return {
    type: GALLERY_CHANGE_SELECT,
    payload: selectIndex
  };
}

export const fetchSectionPagingStart = isRefresh => {
  return {
    type: FETCH_SECTION_PAGINE,
    payload: { isRefresh }
  };
};
export const fetchSectionPagingFail = error => {
  return {
    type: FETCH_SECTION_PAGINE_FAIL,
    error
  };
};

export const fetchSectionPagingSuccess = data => {
  return {
    type: FETCH_SECTION_PAGINE_SUCCESS,
    payload: data
  };
};

// 异步的action
export function fetchSectionPaging(id, isRefresh) {
  return (dispatch, getState) => {
    const store = getState();
    const { page = 0, perPage = 15 } = store.lesson.section.pagination || {};
    dispatch(fetchSectionPagingStart(isRefresh));
    restSectionPaging({ id, page: isRefresh ? 0 : page + 1, pageSize: perPage })
      .then(data => {
        dispatch(fetchSectionPagingSuccess(data));
      })
      .catch(err => dispatch(fetchSectionPagingFail(err)));
  };
}

// cb 用于回调
export function toggleDebugPageInit({ cb, sections, current }) {
  return {
    type: TOGGLE_DEBUG_PAGE_INIT,
    payload: { cb, sections, current }
  };
}

export const fetchSectionDetailStart = isFirstLoad => {
  return {
    type: FETCH_SECTION_DETAIL,
    payload: { isFirstLoad }
  };
};
export const fetchSectionDetailFail = error => {
  return {
    type: FETCH_SECTION_DETAIL_FAIL,
    error
  };
};

export const fetchSectionDetailSuccess = data => {
  return {
    type: FETCH_SECTION_DETAIL_SUCCESS,
    payload: data
  };
};

// 异步的action
export function fetchSectionDetail(id: string) {
  return dispatch => {
    dispatch(fetchSectionDetailStart(id));
    restSectionDetail({ id })
      .then(data => {
        dispatch(fetchSectionDetailSuccess(data));
      })
      .catch(err => dispatch(fetchSectionDetailFail(err)));
  };
}

export function toggleRunningCodeChange(code) {
  return {
    type: TOGGLE_RUNNING_CODE_CHANGE,
    payload: code
  };
}

export function toggleExecCode(code: string | null, cb?: Function | null) {
  // eslint-disable-next-line prefer-const
  let id = 0;
  return (dispatch, getState) => {
    dispatch({ type: DEBUG_RUNNING_CODE })
    let runningCode = code;
    if (!runningCode) {
      const { lesson } = getState();
      runningCode = lesson.debugPage.runningCode;
    }
    Taro.connectSocket({
      url: `${WS_ROOT}/socket`,
      header: {
        // origin: "http://127.0.0.1:8080"
        origin: "https://goexa.qiiso.com:443"
      },
      success: function() {
        console.log("connect success");
      }
    }).then(task => {
      task.onOpen(function() {
        console.log("onOpen");
        task.send({
          data: JSON.stringify({
            Id: "" + id,
            Kind: "run",
            Body: runningCode,
            Options: {}
          })
        });
      });
      task.onMessage(function(msg) {
        console.log("onMessage: ", msg);
        const data = JSON.parse(msg.data);
        dispatch({ type: DEBUG_RUNNING_CODE_SUCCESS, payload: data });
        if (data.Kind === "end") {
          dispatch({ type: DEBUG_RUNNING_CODE_END, payload: data })
          task.close({});
        }
      });
      task.onError(function({ errMsg }) {
        console.log("onError");
        dispatch({ type: DEBUG_RUNNING_CODE_FAIL, error: errMsg });
      });
      task.onClose(function(e) {
        console.log("onClose: ", e);
      });
    });
  };
}

export function clearDebugConsole() {
  return { type: DEBUG_RUNNING_CODE_CLEAR }
}
