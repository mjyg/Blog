//合并Reducer

export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);

  //返回一个合并的reducer
  return function combineAction(state = {}, action) {
    const nextState = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];
      const previousStateForKey = state[key]; //现有的状态
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
    }
    return nextState; //返回更新后的状态
  };
}
