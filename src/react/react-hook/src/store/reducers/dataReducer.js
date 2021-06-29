import {
  FETCH_DATA_FAIL,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_BEGIN,
} from "../actions/dataAction";

//定义初始值
const initialState = {
  data: [],
  loading: false,
  error: null,
};

// 创建reducer
// 当state变化时，需要返回全新的state，不是修改原来的state
// 必须是纯的
export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DATA_BEGIN:
      return {
        ...state,
        loading: true,
        err: null,
      };
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        loading: true,
        data: action.payLoad.data,
      };
    case FETCH_DATA_FAIL:
      return {
        ...state,
        loading: true,
        error: action.payLoad.error,
      };
    default:
      return state;
  }
}
