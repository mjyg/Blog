import React from "react";
import ReactDom from "react-dom";

const memoizedState = []; //维护全局state和effect
let cursor = 0; //memorizedState下标

// 实现useState
// const [count, setCount] = useState(initialCount)
// let state;
function useState(initValue) {
  // state = state || initValue; //如果没有state,就是第一次执行，等于initValue
  memoizedState[cursor] = memoizedState[cursor] || initValue;
  const currentCursor = cursor

  function setState(newState) {
    memoizedState[currentCursor] = newState;
    render(); //重新触发一次渲染
  }
  // return [state, setState];
  return [memoizedState[cursor++], setState]; //取完后下标+1
}

// 实现useEffect
// let _deps; //记录effect第二个参数的上一次状态
function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;
  const deps = memoizedState[cursor];

  // 判断依赖是否改变
  const hasChangeDeps = deps
    ? !depArray.every((el, i) => el === deps[i])
    : true;

  // 如果没有依赖或者依赖被改变
  if (hasNoDeps || hasChangeDeps) {
    callback();
    memoizedState[cursor] = depArray;
  }
  cursor++
}

function App() {
  const [count, setCount] = useState(0);  //cursor:0
  const [name, setName] = useState('a'); //cursor:1

  useEffect(() => {   //cursor:2
    console.log("count改变");
  }, [count]);

  useEffect(() => {  //cursor:3
    console.log("name改变");
  }, [name]);

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>点击count</button>
      <div>{name}</div>
      <button onClick={() => setName(name + 'b')}>点击name</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
function render() {
  cursor = 0;
  ReactDom.render(<App />, rootElement);
}

render();
