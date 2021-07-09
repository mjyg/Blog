# React17源码分析

**目录**
> * [整体架构](#整体架构)
>   * [React15](#React15)
>   * [React16](#React16)
>   * [React17](#React17)
> * [Scheduler(调度器)](#Scheduler(调度器))
>   * [Fiber的结构](#Fiber的结构)
>   * [Fiber Tree](#Fiber-Tree)
>   * [调度逻辑](#调度逻辑)
> * [Reconciler(协调器)](#Reconciler(协调器))
>   * [双缓存结构](#双缓存结构)
>   * [构建Fiber Tree](#构建Fiber-Tree)
>   * [beginWork](#beginWork)
>     * [diff算法](#diff算法)
>       * [单节点diff](#单节点diff)
>       * [多节点diff](#多节点diff)
>   * [completeUnitOfWork](#completeUnitOfWork)
>     * [commitBeforeMutationEffects(DOM操作前)](#commitbeforemutationeffectsdom操作前)
>     * [commitMutationEffects(执⾏DOM操作)](#commitmutationeffects执dom操作)
>     * [recursivelyCommitLayoutEffects(DOM操作后)](#recursivelycommitlayouteffectsdom操作后))
> * [ReactDOM.render流程](#ReactDOMrender流程)

## 整体架构
### React15
![](../image/16256178716322.png)

由Reconciler(协调器)、Render(渲染器)这两个机制负责Dom的更新和渲染。
* Reconciler: 本次更新中哪些节点需要更新，在相应的虚拟DOM打上标记，然后交给Render渲染器，Diff算法就
是发生在这个阶段。这里指虚拟DOM节点的更新，并不是视图层的更新
* Renderer 负责渲染更新的虚拟DOM，根据不同的内容或环境使用不同的渲染器。如渲染jsx内容使用ReactTes
t渲染器，虚拟DOM使用浏览器V8引擎或SSR渲染

渲染流程：对于当前组件需要更新内容是依次更新，Reconciler发现一个需要更新的节点后就交给Renderer渲染器渲染。
完成后Reconciler又发现下个需要更新的节点，再交给Renderer渲染器...直到此次更新内容全部完成，整个更新流程是同步执行的

**batchUpdate机制**<br>
React15默认用batchUpdate做了批处理优化，如下代码，同时执行两次setState操作，只会触发一次render更新，
但是可以用unBatchUpdate来强制更新，比如第一次执行ReactDOM.render()时，页面初始换渲染时，就不需要用
批处理，因为此时页面还是白的，希望能立刻渲染出来

```js
this.setState({
"a": ""
});
this.setState({
"b": ""
 });
```
* 在 react 的 event handler 内部同步的多次 setState 会被 batch 为一次更新
* 在一个异步的事件循环里面多次 setState，react 不会 batch

**React15架构的缺点**<br>
React15是同步更新节点，Reconciler更新一个DOM节点，Renderer更新一次视图，且通过递归的方式进行渲染，
使用的是 JS 引擎自身的函数调用栈，它会一直执行到栈空为止，因此如果是⼀个⻓任务，会导致阻塞⽤⼾后续交互，
会卡顿<br>
![](../image/1625749844966.jpg)

### React16
React16实现了自己的组件调用栈，它以链表的形式遍历组件树，可以灵活的暂停、继续和丢弃执行的任务

React16的Reconciler被称为Fiber Reconciler,Fiber其实指的是一种数据结构,为了加以区分，以前的 
Reconciler 被命名为Stack Reconciler， Fiber Reconciler利用分片的思想，把一个耗时长的任务分成很
多小片，在每个小片执行完之后每执行一段时间，都会将控制权交回给浏览器，可以分段执行：<br>
![](../image/1625750589354.jpg)

为了达到这种效果，就需要有一个调度器 (Scheduler) 来进行任务分配,因此，React16新增了Scheduler模块，
来调度任务的优先级,优先级高的任务（如键盘输入）可以打断优先级低的任务（如Diff）的执行，从而更快的生效

react⾥的优先级：
* ⽣命周期⽅法：同步执⾏
* 受控的⽤⼾输⼊：⽐如输⼊框内输⼊⽂字，同步执⾏
* 交互事件：⽐如动画，⾼优先级执⾏
* 其他：⽐如数据请求，低优先级执⾏

可以在自己的代码中手动更新优先级，在ReactDom中暴露了unstable_runWithPriority方法来更新优先级，可以
像下面这样使用：
```js
import ReactDOM from 'react-dom';
ReactDOM.unstable_runWithPriority(
  1000, // 优先级,
  () => {
    // 要做的更新
  }
)
```

### React17
React17承接了React16的Fiber架构，做了以下两个优化：
* 对优先级的扩展
为了解决react16的不⾜：<br>
1.⾼优先级IO操作会阻塞低优先级CPU操作<br>
2.只能指定⼀个优先级<br>
React17升级为从指定⼀个优先级到指定到指定⼀个连续的优先级区间，避免出现一个很高优先级但运行时间很长的
任务一直执行的情况，如果有低优先级但是在同一个优先级区间的任务，且耗时较少，就可以和该任务同批执行。

优先级区间：
```js
export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;

export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000001;
export const SyncBatchedLane: Lane = /*                 */ 0b0000000000000000000000000000010;

export const InputDiscreteHydrationLane: Lane = /*      */ 0b0000000000000000000000000000100;
const InputDiscreteLanes: Lanes = /*                    */ 0b0000000000000000000000000011000;

const InputContinuousHydrationLane: Lane = /*           */ 0b0000000000000000000000000100000;
const InputContinuousLanes: Lanes = /*                  */ 0b0000000000000000000000011000000;

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000100000000;
export const DefaultLanes: Lanes = /*                   */ 0b0000000000000000000111000000000;

const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000001000000000000;
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111110000000000000;

const RetryLanes: Lanes = /*                            */ 0b0000011110000000000000000000000;

export const SomeRetryLane: Lanes = /*                  */ 0b0000010000000000000000000000000;

export const SelectiveHydrationLane: Lane = /*          */ 0b0000100000000000000000000000000;

const NonIdleLanes = /*                                 */ 0b0000111111111111111111111111111;

export const IdleHydrationLane: Lane = /*               */ 0b0001000000000000000000000000000;
const IdleLanes: Lanes = /*                             */ 0b0110000000000000000000000000000;

export const OffscreenLane: Lane = /*                   */ 0b1000000000000000000000000000000;
```
通过位运算的与操作、或操作来快速得到是属于哪个区间，也可以减少if else操作：
```
DefaultLanes: 0b0000000000000000000111000000000
lane:         0b0000000000000000000100000000000
DefaultLanes & lane 
DefaultLanes | lane
```
> vue编译时优化，react运行时优化

* 剥离了JSX
剥离了JSX,参考[介绍全新的 JSX 转换](https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

## Scheduler(调度器)
调度任务的优先级，高优先级任务优先进入Reconciler(performSyncWorkOnRoot)

调度器流程图(React16)：
![](../image/1625839766088.jpg)<br>
![](../image/1625839783008.jpg)<br>
![](../image/1625840051596.jpg)<br>

### Fiber的结构
Fiber是一个包含很多属性的对象
```js
function FiberNode() {
  // Fiber对应组件的类型 Function/Class/Host
  this.tag = tag;

  // 标志这个节点的唯⼀性，dom diff时使用
  this.key = key;
  this.elementType = null;

  // 对于 FunctionComponent，指函数本⾝，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName。
  this.type = null;

  // Fiber对应的真实DOM节点 <div></div>
  this.stateNode = null;

  // Fiber ⽤于连接其他Fiber节点形成Fiber树
  this.return = null; //父节点
  this.child = null; //子节点
  this.sibling = null; //兄弟节点

  // 保存本次更新造成的状态改变相关信息
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  // 以前是SideEffects, 标志副作用/更新的类型:删除，新增，更改属性
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;

  // 调度优先级相关,以前这⾥是expirationTime.较之于优先级系统，有两个优势：
  // 1. 即较⾼优先级的IO约束任务会阻⽌较低优先级的CPU约束任务⽆法完成
  // 2. 能代表有限的⼀组的多个不同任务
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  // 指向 workInProgress Fiber，其实就是上⼀次构建的Fiber镜像。
  this.alternate = null;
}
```

### Fiber Tree
可以看到Fiber 与 Fiber之间是以链表的形式来连接的，这种结构可以⽅便中断<br>
![](../image/1625753261016.jpg)

### 调度逻辑
* 1.根据优先级区分同步任务和异步任务，同步任务⽴即同步执⾏，最快渲染出来。异步任务⾛scheduler
* 2.计算得到expirationTime，expirationTime = currentTime(当前时间) + timeout (不同优先级的时
间间隔，时间越短，优先级越⼤)
* 3.对⽐startTime和currentTime，将任务分为及时任务和延时任务。
* 4.及时任务当即执⾏
* 5.延时任务需要等到currentTime >= expirationTime的时候才会执⾏。
* 6.及时任务执⾏完后，也会去判断是否有延时任务到了该执⾏之时，如果是，就执⾏延时任务
* 7.每⼀批任务的执⾏在不同的宏任务中，不阻塞⻚⾯⽤⼾的交互

**具体代码分析：**<br>
1.根据优先级区分同步任务和异步任务，同步任务⽴即同步执⾏，最快渲染出来。异步任务⾛scheduler
```js
export const NoContext = /*             */ 0b0000000;
const BatchedContext = /*               */ 0b0000001;
const EventContext = /*                 */ 0b0000010;
const DiscreteEventContext = /*         */ 0b0000100;
const LegacyUnbatchedContext = /*       */ 0b0001000;
const RenderContext = /*                */ 0b0010000;
const CommitContext = /*                */ 0b0100000;
```
```js
export function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  //...
  // 获得当前更新的优先级
  const priorityLevel = getCurrentPriorityLevel();
  // 同步任务，⽴即更新(React16的判断为expiration === Sync)
  if (lane === SyncLane) {
    if (
      // 处于unbatchedUpdates， 且不在Renderer渲染阶段， ⽴即执⾏
      // Check if we're inside unbatchedUpdates
      // executionContext: 执⾏上下⽂,执行时动态赋值
      // LegacyUnbatchedContext: 非批处理
      (executionContext & LegacyUnbatchedContext) !== NoContext &&

      // Check if we're not already rendering
      // CommitContext: 表⽰渲染到⻚⾯的那个逻辑
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // Register pending interactions on the root to avoid losing traced
      //interaction data.
      schedulePendingInteractions(root, lane);
      // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
      // root inside of batchedUpdates should be synchronous, but layout updates
      // should be deferred until the end of the batch.
      performSyncWorkOnRoot(root); //立即执行
    } else {
      // ...
      // 包含异步调度逻辑，和中断逻辑
      ensureRootIsScheduled(root, eventTime);
    }
  } else {
    //...
    // Schedule other updates after in case the callback is sync.
    ensureRootIsScheduled(root, eventTime);
    schedulePendingInteractions(root, lane);
  }
  //mostRecentlyUpdatedRoot = root;
}

function ensureRootIsScheduled(root, currentTime) {
  // root.callbackNode的存活周期是从ensureRootIsScheduled开始——>到commitRootImpl截⽌
// A: ensureRootIsScheduled root.callbackNode已被赋值
// B: ensureRootIsScheduled existingCallbackNode = root.callbackNode 已经存在
  const existingCallbackNode = root.callbackNode;

  // 检查是否存在现有任务。 我们也许可以重⽤它。
  // Check if there's an existing task. We may be able to reuse it.
  if (existingCallbackNode !== null) {
    const existingCallbackPriority = root.callbackPriority;

    // 优先级没有改变。 我们可以重⽤现有任务, 现有任务的优先级和下⼀个任务的优先级相同。
    // ⽐如input连续的输⼊，优先级相同，可以执⾏⽤之前的任务
    // 由于获取更新是从root开始，往下找到在这个优先级内的所有update.
    // ⽐如存在连续的setState，会执⾏这个逻辑，不会新建⼀个新的update
    // this.setState({
    // "a": ""
    // });
    // this.setState({
    // "b": ""
    // });
    // 不需要重新发起⼀个调度，⽤之前那个就可以了（React16这块判断优先级的逻辑不在这里）
    if (existingCallbackPriority === newCallbackPriority) {
      // The priority hasn't changed. We can reuse the existing task. Exit.
      return;
    }
    // React16是判断优先级的⾼低，React17是判断优先级是否相同,用lane
    // 优先级变了，先cancel掉，后续重新发起⼀个
    // 用意是把cancel掉的任务和其他相同优先级的任务合并，再一起执行
    // The priority changed. Cancel the existing callback. We'll schedule a new
    // one below.
    cancelCallback(existingCallbackNode);
  }
  // Schedule a new callback.
  // 发起⼀个新callBack
  let newCallbackNode;
  // ...
  newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );
  root.callbackPriority = newCallbackPriority;
  // root.callbackNode的存活周期是从ensureRootIsScheduled开始——>到commitRootImpl截⽌
  root.callbackNode = newCallbackNode;
}
```

2.计算得到expirationTime，expirationTime = currentTime(当前时间) + timeout (不同优先级的时
间间隔，时间越短，优先级越⼤)<br>
```js
var currentTime = getCurrentTime();
// 得到startTime, 根据优先级的不同分别加上不同的间隔时间，构成expirationTime；
// 当expirationTime越接近真实的时间，优先级越⾼
// 根据startTime 是否⼤于当前的currentTime，将任务分为了及时任务和延时任务。延时任务还不
// 会⽴即执⾏，它会在currentTime接近startTime的时候，才会执⾏
var startTime;
if (typeof options === "object" && options !== null) {
  var delay = options.delay;
  if (typeof delay === "number" && delay > 0) {  //延时任务，该任务在delay时间后执行
    startTime = currentTime + delay;
  } else {
    startTime = currentTime;  //及时任务
  }
} else {
  startTime = currentTime;  //及时任务
}

var timeout;
// 根据优先级增加不同的时间间隔
switch (priorityLevel) {
  case ImmediatePriority:  //立即执行，优先级最高
    timeout = IMMEDIATE_PRIORITY_TIMEOUT;  // -1，加上它比当前时间还小
    break;
  case UserBlockingPriority:
    timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
    break;
  case IdlePriority:
    timeout = IDLE_PRIORITY_TIMEOUT;
    break;
  case LowPriority:
    timeout = LOW_PRIORITY_TIMEOUT;
    break;
  case NormalPriority:
  default:
    timeout = NORMAL_PRIORITY_TIMEOUT;
    break;
}
var expirationTime = startTime + timeout;  //过期时间
```
```js
// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
var maxSigned31BitInt = 1073741823;

// Times out immediately
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;
```

3.对⽐startTime和currentTime，将任务分为及时任务和延时任务<br>
```js
if (startTime > currentTime) {
  push(timerQueue, newTask);
  // 当没有及时任务的时候
  // Schedule a timeout.
  // 在间隔时间之后，调⽤⼀个handleTimeout，主要作⽤是把timerQueue的任务加到
  // taskQueue队列⾥来，然后调⽤requestHostCallback

  // 执⾏那个延时任务
  // setTimeOut(handleTimeout, startTime - currentTime)
  requestHostTimeout(handleTimeout, startTime - currentTime);
} else {
  push(taskQueue, newTask);
  // Schedule a host callback, if needed. If we're already performing work,
  // wait until the next time we yield.
  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    // 这⾥会调度及时任务
    requestHostCallback(flushWork);
  }
}
return newTask;
}
```

4.及时任务当即执⾏,但是为了不阻塞⻚⾯的交互，因此在宏任务中执⾏
```js
// 模拟任务调度流程：
// 一.第⼀次调⽤ scheduleCallback
// 1. 把任务放在timeQueue 不会⽴即执⾏,等待
// 二.第⼆次调⽤ scheduleCallback
// 1. 把任务放在TaskQuene
// 2. 执⾏new MessageChannel() 的 port.postMessage。如果主线程还有任务，那就还不
//    会到performWorkUntilDeadline。
// 三.第三次调⽤ scheduleCallback
// 1. 把任务放在TaskQuene
// 2. 执⾏new MessageChannel() 的 port.postMessage
// 四. 主线程没有任务
// 五. 执⾏微任务列表
// 六. 执⾏宏任务列表
// 七. 执⾏第⼆次调⽤发起的performWorkUntilDeadline
// 八. performWorkUntilDeadline 去取得TaskQuene中的任务，发起 PerformanceSyncWorkOnRoot
// 九. 判断TimeQueue中是否有到期的任务，如果有就加到TaskQuene来
// 十. 主线程
// 十一. 微任务
// 十二. 下⼀个宏任务，执⾏第三次调⽤发起的performWorkUntilDeadline（两个宏任务之间间隔主线程、微任务调用）

const channel = new MessageChannel();  //创建一个消息通道，并可以通过port1和port2两个通道发送数据
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline; //workLoop 
// 在MessageChannel宏任务⾥执⾏真正的调度逻辑，等主线程执行完了再来执行，可以保证任务与任务之间不是连续执⾏的，这样就
// 不会因为要⼀次性执⾏的任务多⽽阻塞⽤⼾的操作
requestHostCallback = function (callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port.postMessage(null);  //在宏任务中调用performWorkUntilDeadline，也可用setTimeout来进入宏任务
    // setTimeout(() => {
    // 进⼊宏任务
    // }, 0)
  }
};
```

附一段MessageChannel使用的使用方法：<br>
![](../image/1625843140212.jpg)

5.延时任务需要等到currentTime >= expirationTime的时候才会执⾏。每次调度及时任务的时候，
  都会去判断延时任务的执⾏时间是否到了，如果判断为true，则添加到及时任务中来。
```js
function advanceTimers(currentTime) {
  // Check for tasks that are no longer delayed and add them to the queue.
  let timer = peek(timerQueue);
  while (timer !== null) {
    if (timer.callback === null) {
      // Timer was cancelled.
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // Timer fired. Transfer to the task queue.
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      // 把timerQueue中的添加到taskQueue中来
      push(taskQueue, timer);
      if (enableProfiling) {
        markTaskStart(timer, currentTime);
        timer.isQueued = true;
      }
    } else {
      // Remaining timers are pending.
      return;
    }
    timer = peek(timerQueue);
  }
}
```

## Reconciler(协调器)

Reconciler的主要作⽤是负责找出变化的组件。在react16以上，为了⽅便打断，数据结构⼏乎都是链表的格式，
会做dom-diff，也会把dom元素⽣成，但是并不会渲染到⻚⾯，⽽是先打上⼀个标记，等在下⼀个commit阶段才会真正
的渲染到⻚⾯。

找出变化的组件：<br>
react发⽣⼀次更新的时候，⽐如ReactDOM.render/setState，都会从Fiber Root开始从上往下遍历,
然后逐⼀找到变化的节点。构建完成会形成⼀颗Fiber Tree。<br>

### 双缓存结构
在 React 中最多会同时存在两棵 Fiber树 。当前屏幕上显⽰内容对应的 Fiber树 称为 current
Fiber树 ，正在内存中构建的 Fiber树 称为 workInProgress Fiber树 。

current Fiber树 中的 Fiber节点 被称为 current fiber ， workInProgress Fiber树
中的 Fiber节点 被称为 workInProgress fiber ，他们通过 alternate 属性连接。

如果之前没有Fiber Tree就逐级创建Fiber Tree；如果存在Fiber Tree，会构建⼀个WorkInProgress
Tree, 这个tree的Fiber节点可以复⽤Current Tree上没有发⽣变化的节点数据。

![](../image/1625755431059.jpg)

为什么是双缓存结构？
* 可以很快的找到之前对应的Fiber
* 在某些情况下可以直接复⽤fiber
* 更新完毕后 current直接指向workInProgress root，完成了Fiber tree的更新

### 构建Fiber Tree
```
return (
  <div>
    i am
    <span>KaSong</span>
  </div>
);
```
这段代码的FiberTree如下：<br>
![](../image/1625755858610.jpg)

源码：
```js
function workLoopSync() {
   // Already timed out, so perform work without checking if we need to yield.
  // workInProgress:当前正在处理的节点
   while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
     // if (next === null) {
     // If this doesn't spawn new work, complete the current work.
     // completeUnitOfWork(unitOfWork);
     //do{
     // sibliing存在的时候， return
     // xxx
     // } while (completedWork !== null);
    // }}
   }

function performUnitOfWork(unitOfWork: Fiber): void {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  const current = unitOfWork.alternate;
  // ...
  // 会创建⼀个Fiber，赋值给workInProgress.child并返回workInProgress.child.注 意，
  //sibilig Fiber，此处暂时还没处理
  // 返回 next = workInProgress.child
  next = beginWork(current, unitOfWork, subtreeRenderLanes);
  // ...
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
  ReactCurrentOwner.current = null;
}
```
在beginWork函数⾥：只创建了这副图中的App， div， iam 3个Fiber。当没有⼦节点时，进⼊到
completeUnitOfWork⾥执⾏，执⾏completeUnitOfWork后如果存在兄弟Fiber节点，就从兄弟Fiber
节点这⾥接着执⾏BeginWork.执⾏完了，⼜接着执⾏completeUnitOfWork。这就是Fiber Tree构建
的整体流程。

### beginWork
* 1.判断Fiber 节点是否可以复⽤
* 2.根据不同的Tag，⽣成不同的Fiber节点（调⽤reconcileChildren）
    * a.Mount 阶段：创建Fiber 节点
    * b.Update阶段 和现在的Fiber节点做对⽐，⽣成新的Fiber节点
        * 单节点Diff
        * 多节点Diff
* 3.给存在变更的Fiber节点打上标记 newFiber.flags = Placement|Update|Deletion|...
* 4.创建的Fiber节点赋给WorkInProgress.child,返回WorkInProgress.child. 继续下⼀次的循环
```js
// {} === {} false
// extra = <div> extra </div>;
// render() => {
// return <div>
// i'm
// {this.extra}
// <Extra />
// </div>
// }
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  const updateLanes = workInProgress.lanes;
  // current tree 存在，不是初次构建
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;
    if (oldProps !== newProps || hasLegacyContextChanged()) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      // 更新的优先级和current tree的优先级是否有⼀致的，不⼀致才触发bailout
      didReceiveUpdate = false;
      // This fiber does not have any pending work. Bailout without entering
      // the begin phase. There's still some bookkeeping we that needs to be done
      // in this optimized path, mostly pushing stuff onto the stack.
      //...
      // didReceiveUpdate = false; 可以复⽤上次的fiber
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    } else {
      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // This is a special case that only exists for legacy mode.
        // See https://github.com/facebook/react/pull/19216.
        didReceiveUpdate = true;
      } else {
        // An update was scheduled on this fiber, but there are no new props
        // nor legacy context. Set this to false. If an update queue or context
        // consumer produces a changed value, it will set this to true. Otherwise,
        // the component will assume the children have not changed and bail out.
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;
  }
  // Before entering the begin phase, clear pending update priority.
  // TODO: This assumes that we're about to evaluate the component and process
  // the update queue. However, there's an exception: SimpleMemoComponent
  // sometimes bails out later in the begin phase. This indicates that we should
  // move this assignment out of the common path and into each branch.
  workInProgress.lanes = NoLanes;
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    //...
    case LazyComponent:
    //...
    case FunctionComponent:
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      // 1. 调⽤renderWithHooks⽅法，注⼊hooks上下⽂, 执⾏function函数体
      // 2. 判断节点是否可以复⽤，能复⽤则调bailoutHooks⽅法复⽤节点
      // 3. 设置flags
      // 4. 调⽤ reconcileChildren，得到⼦Fiber
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
    case ClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      // 执⾏render()等⽣命周期，reconcileChildren
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
    }
    // ReactDOM.render(<App />)
    case HostRoot:
      // 会调到reconcileChildren
      return updateHostRoot(current, workInProgress, renderLanes);
  }
  // ...
}

export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    // Mount阶段，创建Fiber节点
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.
    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    // Update节点，diff后更新Fiber节点
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}

//reconcileChildFibers⾥会判断变更的类型是什么？⽐如有新增，删除，更新等类型。每⼀种类型
//的变更，调⽤不同的⽅法，赋予flags⼀个值.在commit阶段，会直接根据flags来做dom操作。
function placeSingleChild(newFiber: Fiber): Fiber {
  // This is simpler for the single child case. We only need to do a
  // placement for inserting new children.
  if (shouldTrackSideEffects && newFiber.alternate === null) {
    newFiber.flags = Placement;
  }
  return newFiber;
}
```

#### diff算法
React Diff 会预设⼏个规则：
* 1.只对同级节点，进⾏⽐较.
* 2.节点变化，直接删除，然后重建
* 3.存在key值，对⽐key值⼀样的节点
```js
// 代码在ReactChildFiber.new.js 下 reconcileChildFibers函数
// 判断节点是不是react 节点
// Handle object types
const isObject = typeof newChild === "object" && newChild !== null;
if (isObject) {
  // 根据不同的类型，处理不同的节点对⽐
  switch (newChild.$$typeof) {
    case REACT_ELEMENT_TYPE:
      return placeSingleChild(
        reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes)
      );
    //...
  }
}
if (typeof newChild === "string" || typeof newChild === "number") {
  return placeSingleChild(
    reconcileSingleTextNode(
      returnFiber,
      currentFirstChild,
      "" + newChild,
      lanes
    )
  );
}
// 多节点数组
if (isArray(newChild)) {
  return reconcileChildrenArray(
    returnFiber,
    currentFirstChild,
    newChild,
    lanes
  );
}
```

##### 单节点diff
* 1.判断存在对应节点，key值是否相同，节点类型⼀致，可以复⽤
* 2.存在对应节点，key值是否相同，节点类型不⼀致，标记删除
* 3.存在对应节点，key值不同，标记删除
* 4.不存在对应节点，创建新节点
```js
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement,
  lanes: Lanes
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  // 是否存在对应节点
  while (child !== null) {
    // ⽐较key是否相同
    if (child.key === key) {
      switch (child.tag) {
        default: {
          // 节点类型⼀致，可以复⽤
          if (child.elementType === element.type) {
            deleteRemainingChildren(returnFiber, child.sibling);
            const existing = useFiber(child, element.props);
            existing.ref = coerceRef(returnFiber, child, element);
            existing.return = returnFiber;
            return existing;
          }
          break;
        }
      }
      // div => p
      // 节点类型不⼀致才会到这⾥，标记为删除
      // Didn't match.
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key不同，将该fiber标记为删除 flags
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }
  // 不存在对应节点，创建
  const created = createFiberFromElement(element, returnFiber.mode, lanes);
  created.ref = coerceRef(returnFiber, currentFirstChild, element);
  created.return = returnFiber;
  return created;
}
```

##### 多节点diff
* 1. 对⽐新旧children相同index的对象的key是否相等, 如果是，返回该对象，如果不是，返回null
* 2. key值不等，不⽤对⽐下去了，节点不能复⽤，跳出
* 3. 判断节点是否存在移动，存在则返回新位置
* 4. 但可能存在新的数组⼩于⽼数组的情况，即⽼数组后⾯有剩余的，所以要删除
* 5. 新数组存在新增的节点，创建新阶段
* 6. 创建⼀个existingChildren代表所有剩余没有匹配掉的节点，然后新的数组根据key从这个 map
⾥⾯查找，如果有则复⽤，没有则新建
```js
function reconcileChildrenArray(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChildren: Array<*>,
  lanes: Lanes
): Fiber | null {
  let resultingFirstChild: Fiber | null = null;
  let previousNewFiber: Fiber | null = null;
  let oldFiber = currentFirstChild;
  let lastPlacedIndex = 0;
  let newIdx = 0;
  let nextOldFiber = null;
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    // oldIndex ⼤于 newIndex，那么需要旧的 fiber 等待新的 fiber，⼀直等到位置相同
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }
    // 对⽐新旧children相同index的对象的key是否相等, 如果是，返回该对象，如果不是，返回
    //null
    const newFiber = updateSlot(
      returnFiber,
      oldFiber,
      newChildren[newIdx],
      lanes
    );
    // key值不等，不⽤对⽐下去了，节点不能复⽤，跳出
    if (newFiber === null) {
      if (oldFiber === null) {
        oldFiber = nextOldFiber;
      }
      break;
    }
    // 判断节点是否存在移动，存在则返回新位置
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    oldFiber = nextOldFiber;
  }
  // 第⼀个循环完毕
  // newIdx === newChildren.length 说明中途没有跳出的情况
  // 但可能存在新的数组⼩于⽼数组的情况，即⽼数组后⾯有剩余的，所以要删除
  if (newIdx === newChildren.length) {
    // We've reached the end of the new children. We can delete the rest.
    deleteRemainingChildren(returnFiber, oldFiber);
    return resultingFirstChild;
  }
  // oldFiber === null 说明数组中所有的都可以复⽤
  if (oldFiber === null) {
    // 新数组存在新增的节点，创建新阶段
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
      if (newFiber === null) {
        continue;
      }
      // 添加到sibiling62 lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    }
    return resultingFirstChild;
  }
  // 创建⼀个existingChildren代表所有剩余没有匹配掉的节点，然后新的数组根据key从这个
  //map ⾥⾯查找，如果有则复⽤，没有则新建
  const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
  // Keep scanning and use the map to restore deleted items as moves.
  for (; newIdx < newChildren.length; newIdx++) {
    // 对⽐是否还有可以复⽤的
    const newFiber = updateFromMap(
      existingChildren,
      returnFiber,
      newIdx,
      newChildren[newIdx],
      lanes
    );
    if (newFiber !== null) {
      // 判断节点是否存在移动，存在则返回新位置
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    }
  }
  return resultingFirstChild;
}
```

### completeUnitOfWork
commit阶段——负责将变化的组件渲染到⻚⾯上commit阶段⸺负责将变化的组件渲染到⻚⾯上

分为下面三个小阶段

#### commitBeforeMutationEffects(DOM操作前)
* 1.处理 DOM节点 渲染/删除后的 autoFocus 、 blur 逻辑。
* 2.调⽤ getSnapshotBeforeUpdate ⽣命周期钩⼦。
* 3.调度 useEffect。
```js
// class A extrends Component{
//  getSnapshotBeforeUpdate(){
//   console.log(1);
//   }
//  render(){
//   return <B> </B>
//   }
//  }
// class B extrends Component{
//   getSnapshotBeforeUpdate(){
//     console.log(2);
//   }
//   render(){
//   return <div> </div>
//  }

function commitBeforeMutationEffects(firstChild: Fiber) {
  let fiber = firstChild;
  while (fiber !== null) {
    // 处理需要删除的fiber autoFocus、blur 逻辑。
    if (fiber.deletions !== null) {
      commitBeforeMutationEffectsDeletions(fiber.deletions);
    }
    // 递归调⽤处理⼦节点
    if (fiber.child !== null) {
      commitBeforeMutationEffects(fiber.child);
    }
    try {
      // 调⽤ getSnapshotBeforeUpdate ⽣命周期
      // 异步调度useEffect
      commitBeforeMutationEffectsImpl(fiber);
    } catch (error) {
      captureCommitPhaseError(fiber, fiber.return, error);
    } // 返回兄弟节点，接着循环
    fiber = fiber.sibling;
  }
}

// 在beginWork⾥，存在getSnapshotBeforeUpdate的时候，fiber.flags |= Snapshot;
function commitBeforeMutationEffectsImpl(fiber: Fiber) {
  const current = fiber.alternate;
  const flags = fiber.flags;
  if ((flags & Snapshot) !== NoFlags) {
    // 调⽤ getSnapshotBeforeUpdate ⽣命周期
    commitBeforeMutationEffectOnFiber(current, fiber);
  }
  // tags
  if ((flags & Passive) !== NoFlags) {
    // If there are passive effects, schedule a callback to flush at
    // the earliest opportunity.
    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true;
      // 异步调度 useEffect 的回调并不是在 dom渲染前执⾏的。
      // useLayoutEffect 在dom操作后同步执⾏回调
      // useEffect 异步执⾏回调。不想阻塞主线程。可以先尝试使⽤useEffect。不⾏的话再使⽤
      // useLayoutEffect。
      scheduleCallback(NormalSchedulerPriority, () => {
        flushPassiveEffects();
        return null;
      });
    }
  }
}
```

#### commitMutationEffects(执⾏DOM操作)
* 1.遍历finishedWork，执⾏DOM操作
* 2.对于删除的组件，会执⾏componentWillUnMount⽣命周期
```js
// 结构和上⾯的⼀样
function commitMutationEffects(
  firstChild: Fiber,
  root: FiberRoot,
  renderPriorityLevel: ReactPriorityLevel
) {
  let fiber = firstChild;
  while (fiber !== null) {
    const deletions = fiber.deletions;
    if (deletions !== null) {
      // 需要卸载的组件，会调⽤componentWillUnMount
      commitMutationEffectsDeletions(
        deletions,
        fiber,
        root,
        renderPriorityLevel
      );
    }
    if (fiber.child !== null) {
      // 仍然是递归调⽤处理⼦Fiber
      commitMutationEffects(fiber.child, root, renderPriorityLevel);
    }
    try {
      // 区分不同情Flag 执⾏不同的Dom操作
      // 已经构造好了dom元素了，存放在stateNode节点的。新增，删除，替换？
      commitMutationEffectsImpl(fiber, root, renderPriorityLevel);
      // ⻚⾯就终于渲染出来了
    } catch (error) {
      captureCommitPhaseError(fiber, fiber.return, error);
    }
    // 处理兄弟节点
    fiber = fiber.sibling;
  }
}
```

#### recursivelyCommitLayoutEffects(DOM操作后)
在这个阶段前current tree也发⽣变化了，指向了最新构建的workInProgress tree。
* 1.layout阶段 也是深度优先遍历 effectList ，调⽤⽣命周期，didMount/didUpdate；执⾏
useEffect
* 2.赋值 ref
* 3.处理ReactDom.render 回调
```js
// A,B两个组件，⽣命周期getSnapshotBeforeUpdate，componentDidMount，
//componentWillMount,
// componentWillUnMount 问整体的执⾏顺序？
// 哪⼏个是在commit阶段执⾏的？哪⼏个是在BeginWork⾥执⾏的？
// class A extrends Component{
//   componentDidMount(){
//     console.log(1);
//   }
//   componentDidUpdate(){
//     console.log(1);
//  }
//  render(){
//   return <B> </B>
//   }
//  }
//
// class B extrends Component{
//  componentDidMount(){
//   console.log(2);
//  }
//   componentDidUpdate(){
//  console.log(2);
//  }
//  render(){
//   return <div> </div>
//  }
// }
//
// ReactDOM.render(<App/>, $("#app"), () => {
//  console.log('');
//  });

function recursivelyCommitLayoutEffects(
  finishedWork: Fiber,
  finishedRoot: FiberRoot
) {
  const { flags, tag } = finishedWork;
  switch (tag) {
    //...
    default: {
      let child = finishedWork.child;
      while (child !== null) {
        //...
        try {
          // 仍然是递归
          recursivelyCommitLayoutEffects(child, finishedRoot);
        } catch (error) {
          captureCommitPhaseError(child, finishedWork, error);
        }
        child = child.sibling;
      }
      const primaryFlags = flags & (Update | Callback);
      if (primaryFlags !== NoFlags) {
        switch (tag) {
          case FunctionComponent:
          case ForwardRef:
          case SimpleMemoComponent:
          case Block: {
            //...
            // 执⾏useEffect的回调
            commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
            break;
          }
          case ClassComponent: {
            // 执⾏componentDidMount/didUpdate ⽣命周期
            // NOTE: Layout effect durations are measured within this function.69 commitLayoutEffectsForClassComponent(finishedWork);
            break;
          }
        }
        //...
        // 赋值ref
        if (flags & Ref && tag !== ScopeComponent) {
          commitAttachRef(finishedWork);
        }
        break;
      }
    }
  }
}
```

## ReactDOM.render流程
是⾛的unBatchUpdate ，所以是没有⾛schedule调度的，直接就到了Reconciler阶段了。
* unBatchUpdate 不批处理
* batchUpdate 批处理