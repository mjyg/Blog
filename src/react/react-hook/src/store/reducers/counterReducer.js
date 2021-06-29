import { ADD, REDUCE } from "../actions/counterAction";

//定义初始值
const initialState = {
  count: 0,
};

// 创建reducer
// 当state变化时，需要返回全新的state，不是修改原来的state
// 必须是纯的
export default function counterReducer(state = initialState, action) {
  switch (action.type) {
    case ADD:
      return {
        count: state.count + 1,
      };
    case REDUCE:
      return {
        count: state.count - 1,
      };
    default:
      return state;
  }
}

