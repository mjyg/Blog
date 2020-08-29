export default function createStore(initState) {
  let state = initState; //状态
  let listeners = []; //监听队列

  //订阅，状态改变通知订阅者，把订阅者的方法存入到监听队列中
  function subscribe(listener) {
    listeners.push(listener);
  }

  //获取状态
  function getState() {
    return state;
  }

  //改变状态，执行监听队列中订阅者的方法
  function changeState(newState) {
    state = newState;
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  return {
    subscribe,
    getState,
    changeState,
  };
}
