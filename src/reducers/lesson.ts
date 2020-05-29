import {
  FETCH_SANDBOX_LIST,
  FETCH_SANDBOX_LIST_FAIL,
  FETCH_SANDBOX_LIST_SUCCESS,
  FETCH_LESSON_PAGINE,
  FETCH_LESSON_PAGINE_SUCCESS,
  FETCH_LESSON_PAGINE_FAIL,
  GALLERY_CHANGE_SELECT,
  FETCH_SECTION_PAGINE,
  FETCH_SECTION_PAGINE_SUCCESS,
  FETCH_SECTION_PAGINE_FAIL,
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

const INITIAL_STATE = {
  loading: false,
  list: [],
  pagination: {
    total: 0,
    page: 0,
    perPage: 15,
    prev: 0,
    next: 1,
    totalPage: 0
  }
};

function fetchSuccess(state, data) {
  return {
    ...state,
    list: data,
    loading: false
  };
}

function fetchGallerySuccess(state, data) {
  return {
    ...state,
    list: data.docs,
    pagination: data.pagination,
    loading: false
  };
}

const GALLERY_INITIAL_STATE = {
  category: "tour",
  loading: false,
  list: [],
  selectIndex: 0,
  pagination: {
    total: 0,
    page: 0,
    perPage: 5,
    prev: 0,
    next: 1,
    totalPage: 0
  }
};
export function gallery(state = GALLERY_INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_LESSON_PAGINE:
      return {
        ...state,
        loading: true,
        // 切换页，页索引更新为0
        selectIndex: 0,
      };
    case FETCH_LESSON_PAGINE_SUCCESS:
      return fetchGallerySuccess(state, action.payload.data);
    case FETCH_LESSON_PAGINE_FAIL:
      return {
        ...state,
        loading: false,
        list: []
      };
    case GALLERY_CHANGE_SELECT:
      return {
        ...state,
        selectIndex: action.payload
      };
    default:
      return state;
  }
}

export function sandbox(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SANDBOX_LIST:
      return {
        ...state,
        loading: true
      };
    case FETCH_SANDBOX_LIST_SUCCESS:
      return fetchSuccess(state, action.payload.data);
    case FETCH_SANDBOX_LIST_FAIL:
      return {
        ...state,
        loading: false,
        list: []
      };
    default:
      return state;
  }
}

// section

const SECTION_INITIAL_STATE = {
  loading: false,
  list: [],
  pagination: {
    total: 0,
    page: 0,
    perPage: 15,
    prev: 0,
    next: 1,
    totalPage: 0
  }
};

function fetchSectionSuccess(state, data) {
  return {
    ...state,
    list: [...state.list, ...data.docs],
    pagination: data.pagination,
    loading: false
  };
}

export function section(state = SECTION_INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SECTION_PAGINE:
      return {
        ...(action.payload.isRefresh ? INITIAL_STATE : state),
        loading: true
      };
    case FETCH_SECTION_PAGINE_SUCCESS:
      return fetchSectionSuccess(state, action.payload.data);
    case FETCH_SECTION_PAGINE_FAIL:
      return {
        ...state,
        loading: false,
        list: []
      };
    default:
      return state;
  }
}

const DEBUG_PAGE_INIT_STATE = {
  current: {},
  sections: [],
  loading: true,
  running: true,
  runningCode: "",
  runningResult: [],
  runningError: null,
  runningEnd: null,
};

function fetchSectionDetailSuccess(state, data) {
  return {
    ...state,
    current: { ...data },
    loading: false
  };
}

export function debugPage(state = DEBUG_PAGE_INIT_STATE, action) {
  switch (action.type) {
    case TOGGLE_DEBUG_PAGE_INIT:
      return {
        ...state,
        ...action.payload
      };
    case FETCH_SECTION_DETAIL:
      return {
        ...state,
        loading: true
      };
    case FETCH_SECTION_DETAIL_SUCCESS:
      return fetchSectionDetailSuccess(state, action.payload);
    case FETCH_SECTION_DETAIL_FAIL:
      return {
        ...state,
        current: {},
        loading: false
      };
    case TOGGLE_RUNNING_CODE_CHANGE:
      return {
        ...state,
        runningCode: action.payload
      }
    case DEBUG_RUNNING_CODE_CLEAR:
      return {
        ...state,
        runningResult: [],
        running: false,
        runningEnd: null
      }
    case DEBUG_RUNNING_CODE:
      return {
        ...state,
        // runningResult: [],
        running: true,
        runningEnd: null
      }
    case DEBUG_RUNNING_CODE_SUCCESS:
      return {
        ...state,
        // only `end` or `fail`
        // running: false,
        runningResult: [...state.runningResult, action.payload]
      }
    case DEBUG_RUNNING_CODE_FAIL:
      return {
        ...state,
        running: false,
        runningError: action.error
      }
    case DEBUG_RUNNING_CODE_END:
      return {
        ...state,
        runningEnd: action.payload,
        running: false,
      }
    default:
      return state;
  }
}
