/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// Keep in sync with https://github.com/facebook/flow/blob/master/lib/react.js
export type StatelessFunctionalComponent<
  P,
> = React$StatelessFunctionalComponent<P>;
export type ComponentType<-P> = React$ComponentType<P>;
export type AbstractComponent<
  -Config,
  +Instance = mixed,
> = React$AbstractComponent<Config, Instance>;
export type ElementType = React$ElementType;
export type Element<+C> = React$Element<C>;
export type Key = React$Key;
export type Ref<C> = React$Ref<C>;
export type Node = React$Node;
export type Context<T> = React$Context<T>;
export type Portal = React$Portal;
export type ElementProps<C> = React$ElementProps<C>;
export type ElementConfig<C> = React$ElementConfig<C>;
export type ElementRef<C> = React$ElementRef<C>;
export type Config<Props, DefaultProps> = React$Config<Props, DefaultProps>;
export type ChildrenArray<+T> = $ReadOnlyArray<ChildrenArray<T>> | T;
export type Interaction = {
  name: string,
  timestamp: number,
  ...
};

// Export all exports so that they're available in tests.
// We can't use export * from in Flow for some reason.
export {
  Children,
  createRef,
  Component,
  PureComponent,
  createContext,
  forwardRef,
  lazy,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useMutableSource,
  useMutableSource as unstable_useMutableSource,
  createMutableSource,
  createMutableSource as unstable_createMutableSource,
  Fragment,
  Profiler,
  unstable_DebugTracingMode,
  StrictMode,
  Suspense,
  createElement,
  cloneElement,
  isValidElement,
  version,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  createFactory,
  useTransition,
  useTransition as unstable_useTransition,
  startTransition,
  startTransition as unstable_startTransition,
  useDeferredValue,
  useDeferredValue as unstable_useDeferredValue,
  SuspenseList,
  SuspenseList as unstable_SuspenseList,
  block,
  block as unstable_block,
  unstable_LegacyHidden,
  unstable_createFundamental,
  unstable_Scope,
  unstable_useOpaqueIdentifier,
} from './src/React';


import { 
  useState, 
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  useReducer
} from 'react';
import { unstable_batchedUpdates as batchedUpdates} from 'react-dom';

// 1个前提 hooks只能在 function component 使用
// renderWithHooks 方法才会注入hooks上下文
// useState: 在function component定义state
// useEffect 模拟生命周期， didMount+didUpdate+willUnMount
// useCallback: 把函数缓存一下
// useMemo: 把值缓存一下
// useRef: 和ref一样的功能
// useContext+useReducer：在function component使用context
// context API  实现一个redux？

// useState:
// 1. mountState 得到初始化的state "一灯"
// 2. dispatchAction => setName 会创建一个update，
// 会判断当前当前有没有任务存在？没有的话，就先执行setName的回调，把值放在eagerState的属性上
// 然后发起performanceSyncWorkOnRoot
// 3. 导致function A 会重新执行
// 4. useState => updateState, 才执行出setName的回调，把memorizeState更新了

// useEffect:
// 初始化:
// 1. mountEffect: 是在beginWork执行的，打上flags标记，推入一个Effect的链表
// 2. 在commit阶段的dom更新完毕后，才会执行useEffect的回调，并把create的返回值赋值给distory
// state变化了:
// 3. updateEffect 是在beginWork执行的,对比依赖是否发生变化，如不一样，设置EffectTag，则重新push一个新的Effect，
// 依赖发生变化：
// 4. commit阶段开始，在flushPassiveEffects 执行distory
// 5. 那么在commit阶段dom更新完毕后才会又执行useEffect的回调
function A (){
  // const [name, setName] = useState(() => "一灯");
  const [name, setName] = useState("一灯");
  const [age1, setAge1] = useState(20);
  // 执行时机在commit阶段的dom渲染之后
  // 相当于componentDidMount生命周期
  useEffect(() => {
    console.log('12');
    // 会做两次更新， 在hooks里暂时没有批处理
    batchedUpdates(() => {
      setName("二灯");
      setName((name) => {
        // name就是上一次的name的值
        return '新name'
      })
    });
    // setName之后是怎么触发组件的重新渲染的呢？
    // 值又是怎么更新的呢？
  }, []);
  // 在name变化的时候，useEffect的回调也会执行，componentDidUpdate
  useEffect(create:() => {
    console.log('12');
    const onHandle = () => {}
    document.addEventListener("click", onHandle);
    // 它会在commit阶段的dom渲染之后，它会被当做willUnMount执行
    return distory:() => {
      console.log('distory')
      document.removeEventListener("click", onHandle);
    }
  }, deps:[name]);

  useEffect(() => {
    console.log('12');
    const onHandle = () => {}
    document.addEventListener("click", onHandle);
    // 它会在commit阶段的dom渲染之后，它会被当做willUnMount执行
    return () => {
      console.log('distory')
      document.removeEventListener("click", onHandle);
    }
  }, [age]);
  
  // 每次有更新的时候，就会创建一个新的function
  // 没有依赖的时候，就返回缓存了的函数
  // age变化的时候，会返回新的函数，age没变就返回之前的缓存的函数
  const onClick = useCallback(() => {
    setAge1(34)
    // this.setState()
  }, [age]);
  // useMemo(xxx, []); // div 最终也是一个对象
  return <div>
    {name}
    <B onClick={onClick}></B>
  </div>
}

// class component: shouldComponentUpdate 判断是否要更新
// PureComponent 默认对props做了shouldComponentUpdate
// React.memo + useCallback
// 没有memo的时候，根本就不比较
// PureComponent一样
const B = React.memo(() => {
  console.log('B');
  return <div></div>
});
// React.memo 会对组价做一层props的浅比较，类似shouldComponentUpdate的逻辑
// React.useMemo 是hooks里对值的缓存，依赖变化的时候才会更新，依赖不变也不变
