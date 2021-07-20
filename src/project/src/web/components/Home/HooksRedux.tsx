import * as React from "react";

const { useReducer, useContext, createContext } = React;

interface IState {
  name: string;
  age: number;
}

// 一定要返回一个状态回去
function reducerInAction(state,action){
  if(typeof action.reducer === 'function') {
    return action.reducer(state)
  }
  return state;
}

export default function createStore(params: IState) {
  const { initialState ={}, reducer} = {
    ...params,
    reducer:reducerInAction
  };

  //实际是由createContext做所有状态版本的管理
  const AppContext = createContext();

  const middleWareReducer=(lastState,action)=>{
    // switch (action.type) {
    //   case "init":
    //     return {...lastState, age: action.reducer}; //返回新的state
    //   default:
    //     return lastState;
    // }
    let nextState = reducer(lastState,action)
    store._state = nextState
    return nextState
  }

  const store = {
    _state: initialState,
    dispatch(action) {},
    getState() {
      return store._state;
    },
    useContext: () => {
      return useContext(AppContext);
    },
  };

  const Provider = (props) => {
    const [state, dispatch] = useReducer(middleWareReducer,initialState);
    if (!store.dispatch) {
      store.dispatch = async (action) => {
        if(typeof action === "function"){
          await action(dispatch,state.getState())
        }else {
          dispatch(action)
        }
      };
    }
    return <AppContext.Provider value={state} {...props} />;
  };

  return {
    Provider,
    store,
  };
}
