//负责接收action，根据action的type做具体的事,把状态管理按计划包含在reducer里
let initState = {
  count: 0,
};

export default function counterReducer(state, action) {
  if(!state) {
    state = initState
  }
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count+1
      };
    case "DECREMENT":
      return {
        ...state,
        count: state.count-1
      };
    default:
      return state;
  }
}
