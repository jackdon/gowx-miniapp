import {
  FETCH_DETAIL,
  FETCH_DETAIL_FAIL,
  FETCH_DETAIL_SUCCESS,
  TOGGLE_EXAMPLE_SHOW_MODE
} from "../constants/detail";

const INITIAL_STATE = {
  loading: false,
  data: {},
  showMode: false
};

function fetchSuccess(state, data) {
  return {
    ...state,
    data
  };
}

export default function detail(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DETAIL:
      return {
        loading: true,
        data: {}
      };
    case FETCH_DETAIL_SUCCESS:
      return fetchSuccess(state, action.payload.data);
    case FETCH_DETAIL_FAIL:
      return {
        ...state,
        data: {}
      };
    case TOGGLE_EXAMPLE_SHOW_MODE:
      return {
        ...state,
        showMode: action.payload
      };
    default:
      return state;
  }
}
