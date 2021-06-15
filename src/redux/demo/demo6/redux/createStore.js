export default function createStore(reducer, initState) {
  let state = initState; //状态
  let listeners = []; //监听队列

  //订阅
  function subscribe(listener) {
    listeners.push(listener);
  }

  //获取状态
  function getState() {
    return state;
  }

  //改变状态
  function dispatch(action) {
    //reducer负责更新数据
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  //替换reducer
  function replaceReducer(nextReducer) {
    reducer = nextReducer;
    //执行一遍listener()
    dispatch({ type: Symbol() });
  }

  dispatch({type:Symbol()})

  return {
    subscribe,
    getState,
    dispatch,
    replaceReducer
  };
}
