# React17源码分析

## React15
## 整体架构<br>
![](../image/16256178716322.png)

有Reconciler(协调器)、Render(渲染器)这两个机制负责Dom的更新和渲染。
* Reconciler: 本次更新中哪些节点需要更新，在相应的虚拟DOM打上标记，然后交给Render渲染器，Diff算法就
是发生在这个阶段。这里指虚拟DOM节点的更新，并不是视图层的更新
* Renderer 负责渲染更新的虚拟DOM，根据不同的内容或环境使用不同的渲染器。如渲染jsx内容使用ReactTes
t渲染器，虚拟DOM使用浏览器V8引擎或SSR渲染

渲染流程：对于当前组件需要更新内容是依次更新，Reconciler发现一个需要更新的节点后就交给Renderer渲染器渲染。
完成后Reconciler又发现下个需要更新的节点，再交给Renderer渲染器...直到此次更新内容全部完成，整个更新流程是同步执行的

## batchUpdate机制
React15用batchUpdate做了批处理优化，如下代码，同步执行两次setState操作，只会触发一次render更新，
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
