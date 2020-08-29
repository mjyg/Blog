# 手写一个Redux
**目录**
> * [Redux介绍](#Redux介绍)
> * [源码分析](#源码分析)
> * [手写Redux](#手写Redux)
>   * [第一步：增加store基本方法（订阅、获取状态、改变状态）](#第一步)
>   * [第二步：增加reducer，通过派发action改变状态](#手写Redux第二步)
>   *

## Redux介绍
Redux是一个用来管理管理数据状态和UI状态的JavaScript应用工具。随着JavaScript单页应用（SPA）开发日趋
复杂，JavaScript需要管理比任何时候都要多的state（状态），Redux就是用来降低管理难度的。（Redux支持
React，Vue、Angular、jQuery甚至纯JavaScript）<br>
Redux 就是 Flux 的升级版本，早期使用 React 都要配合 Flux 进行状态管理，但是在使用中，Flux 显露了很多
弊端，比如多状态管理的复杂和易错。所以 Redux 就诞生了，还吸取了部分精华，现在已经完全取代了 Flux。<br>
举个🌰<br>
![](/assets/redux/redux_flow.png)<br>
借书者(Components)要去借书。那要先去找管理员(ActionCreator)借书，管理员先去图书馆柜台机上(Store) 用
图书管理软件(Reducers)找,找到了就给这个借阅者(Components)告诉正确的位置，和图书的信息，没找到或者已经
借阅出去了，给反馈信息，还书也是一样

## 源码分析
Redux其实是一个比较典型的函数式编程的应用实例（[点击这里了解函数式编程](/functional-programming/base.md)）<br>
源码目录和基本功能如下:<br>
> * applyMiddleware.js  中间件（IO函子）
> * bindActionCreators.js  产生action
> * combineReducers.js  合并reducer
> * compose.js  函数组合
> * createStore.js  创建store
> * index.js  导出模块
> * utils工具文件夹，存放一些工具性的文件<br>
>
Redux各部分分析：
> * store -> container
> * currentState -> _value
> * action -> f 变形关系
> * reducer -> map
> * middleware -> IO functor （解决异步和脏操作）<br>
接下来按照源码结构来一步一步实现一个Redux<br>
>
## 手写Redux
### 第一步
在根目录新建Redux文件夹，建立createStore.js,写好store的基本三个方法：订阅、获取状态、改变状态
```js
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
```
新建index.js,导出CreateStore:
```js
// export {createStore} from './createStore';
import createStore from "./createStore.js";
export { createStore };
```
在根目录建立index.html使用createStore:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>
  <body>
    <script type="module">
      import { createStore } from "./redux/index.js";
      let initState = {
        counter: {
          count: 0,
        },
        info: {
          name: "",
          description: "",
        },
      };

      //创建store
      const store = createStore(initState);

      //订阅，状态改变通知订阅者，把订阅者的方法存入到监听队列中
      store.subscribe(() => {
        const state = store.getState();
        console.log(state.counter.count);
      });
      store.subscribe(() => {
        const state = store.getState();
        console.log(state.info.name + state.info.description);
      });

      //改变状态，执行监听队列中订阅者的方法
      store.changeState({
        ...store.getState(),
        info: {
          name: "Jie",
          description: "好好写代码",
        },
      });
      store.changeState({
        ...store.getState(),
        counter: {
          count: 1,
        },
      });

      /* 输出
      0
      Jie好好写代码
      1
      Jie好好写代码
     */
     
    </script>
  </body>
</html>
```
从输出结果可以看出，每一次状态改变会通知到所有的订阅者，执行订阅者提供的方法<br>
但是实际使用中不能随便用changeState改变状态，要遵循redux架构，通过一定的规则改变状态<br>
🌰 [点击这里查看本例demo](./demo/demo1)

### 第二步
在这一步优化changState,增加reducer,通过派发action改变状态<br>
> 📚 Reducers 指定了应用状态的变化如何响应 actions 并发送到 store 的，记住 actions 只是描述了有事情
> 发生了这一事实，并没有描述应用如何更新 state。<br>
在根目录新建reducer.js:
```js
//负责接收action，根据action的type做具体的事,把状态管理按计划包含在reducer里
export default function reducer(state, action) {
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
```
createStore修改如下，把changeState改为dispatch方法，并通过传入的reducer更新数据
```js
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
    //通知所有的订阅者
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  return {
    subscribe,
    getState,
    dispatch,
  };
}
```
在index.html中创建store的时候引入reducer,通过调用dispatch来派发action改变状态
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>
  <body>
    <script type="module">
      import { createStore } from "./redux/index.js";
      import reducer from './reducer.js'
      let initState = {
          count: 0,
        info: {
          name: "",
          description: "",
        },
      };

      //创建store,传入reducer
      const store = createStore(reducer,initState);

      //订阅，状态改变通知订阅者，把订阅者的方法存入到监听队列中
      store.subscribe(() => {
        const state = store.getState();
        console.log(state.count);
      });
      store.subscribe(() => {
        const state = store.getState();
        console.log(state.info.name + state.info.description);
      });

      //通过派发改变状态
      store.dispatch({
        type: "INCREMENT",
      });
      store.dispatch({
        type: "DECREMENT",
      });
    </script>
  </body>
</html>
```
这样我们就能够通过使用特定的action来改变状态，而不是随意改变<br>
但是，在实际项目中一定有很多的状态需要改变，那么接下来就需要把reducer拆分成多个
🌰 [点击这里查看本例demo](./demo/demo2)

### 第三步