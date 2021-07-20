import * as React from "react";
import HooksRedux from "./HooksRedux";

const { Provider, store } = HooksRedux({
  name: "a",
  age: 12,
});

const Home = () => {
  const state = store.useContext();
  return (
    <div>
      {state.age}
      基础的Home组件
      <Button />
    </div>
  );
};

function timeOutAdd(a) {
  return new Promise((cb) => setTimeout(() => cb(a + 1), 500));
}

const actionAsyncOfAdd = () => async (dispatch, ownState) => {
  const age = await timeOutAdd(ownState.age);
  dispatch({
    type: "init",
    reducer(state) {
      return {
        ...state,
        age,
      };
    },
  });
};

// const actionOfAdd = () => {
//   return {
//     type: "init",
//     reducer(state) {
//       return {
//         ...state,
//         age: state.age + 1,
//       };
//     },
//   };
// };

const Button = () => {
  function handleAdd() {
    store.dispatch(actionAsyncOfAdd);
  }
  return <button onClick={handleAdd}>点击增加</button>;
};

const WrapHome = () => {
  return (
    <Provider>
      <Home />
    </Provider>
  );
};

export default WrapHome;
