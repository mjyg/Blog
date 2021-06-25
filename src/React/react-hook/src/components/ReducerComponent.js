import React, { useReducer } from "react";

//第一个参数
const reducer = (state, action) => {
  switch (action.type) {
    case "add":
      return { ...state, count: state.count + 1 }; //返回新的state
    case "reduce":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

//第二个参数：管理数据的仓库,指定默认值
let initialState = { count: 10, name: "reducer" };

//第三个参数：把第二个参数当做参数传入,对初始值进行一些操作
const init = (initialCount) => {
  return { count: initialCount.count + 2 };
};

export default function ReducerComponent() {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "add" })}>加</button>
      <button onClick={() => dispatch({ type: "reduce" })}>减</button>
    </div>
  );
}
