import {
  FETCH_LIST,
  FETCH_LIST_FAIL,
  FETCH_LIST_SUCCESS
} from "../constants/index";

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
  },
};

function fetchSuccess(state, data) {
  return {
    ...state,
    list: [...state.list, ...data.docs],
    pagination: data.pagination,
    loading: false,
  }
}

export default function indexPage(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_LIST:
      return {
        ...(action.payload.isFirstLoad? INITIAL_STATE : state),
        loading: true,
      };
    case FETCH_LIST_SUCCESS:
      return fetchSuccess(state, action.payload.data);
    case FETCH_LIST_FAIL:
      return {
        ...state,
        loading: false,
        list: []
      };
    default:
      return state;
  }
}
