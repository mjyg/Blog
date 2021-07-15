# 手写useState和useEffect

## 实现useState
```js
// const [count, setCount] = useState(initialCount)
let state;
function useState(initValue) {
  state = state || initValue; //如果没有state,就是第一次执行，等于initValue
  function setState(newState) {
    state = newState;
    render(); //重新触发一次渲染
  }
}
```

## 实现useEffect:
1.接收两个参数，callback和deps
2.如果没有deps， callback每次都执行
3.deps有，只有deps发生变化才执行callback
```js
let _deps; //记录effect第二个参数的上~~~~一次状态
function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;

  // 判断依赖是否改变
  const hasChangeDeps = _deps
    ? !depArray.every((el, i) => el === _deps[i])
    : true;

  // 如果没有依赖或者依赖被改变
  if (hasNoDeps || hasChangeDeps) {
    callback();
    _deps = depArray;
  }
}
```
使用方式如下：
```js
import React from "react";
import ReactDom from "react-dom";

// 实现useState
// const [count, setCount] = useState(initialCount)
let state;
function useState(initValue) {
  state = state || initValue; //如果没有state,就是第一次执行，等于initValue
  function setState(newState) {
    state = newState;
    render(); //重新触发一次渲染
  }
  return [state, setState];
}

// 实现useEffect
let _deps; //记录effect第二个参数的上一次状态
function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;

  // 判断依赖是否改变
  const hasChangeDeps = _deps
    ? !depArray.every((el, i) => el === _deps[i])
    : true;

  // 如果没有依赖或者依赖被改变
  if (hasNoDeps || hasChangeDeps) {
    callback();
    _deps = depArray;
  }
}

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('a');

  useEffect(()=>{
    console.log('count改变')
  },[count])

  return (
    <div>
      <div>{count}</div>
      <div>{name}</div>
      <button onClick={() => setCount(count + 1)}>点击</button>
    </div>
  );
}

const rootElement = document.getElementById("root");
function render() {
  ReactDom.render(<App />, rootElement);
}

render();
```
useState和useEffect是可以正常使用的但是当多加了个state:name,当改变count时name会跟着一起改变，原因是
只有一个全局的state

修改：用一个数组来维护全局state和effect
```js
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

  useEffect(() => {
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
  cursor = 0;  //每次重新渲染要初始化下标，在react源码里使用环形链表来存全局的状态，所以不需要这一步
  ReactDom.render(<App />, rootElement);
}

render();
```
在这里用数组来存取全局状态和数据，在react源码里使用环形链表来存全局的状态

📚 为什么不能在循环或if里面使用hooks?
因为状态和数据都存到链表里面，如果循环数目或if条件变更，下次再取数据就会变更,就会混乱

📚 自定义的hook如何影响使用它的函数组件？
因为共享全局的状态，保持了统一的顺序