# React 性能优化

对于React应用，怎么优化它的性能？<br>

## 1.应用加载性能
加载过程，页面渲染过程

**怎么优化CDN对于静态资源的缓存？**<br>
缓存和回源<br>
缓存分为缓存刷新和缓存预热<br>
* 缓存刷新：客户端第一次请求的时候CDN从源站拉取资源<br>
* 缓存预热：源站资源更新的时候主动推送到CDN

回源：CDN上没有找到资源，到源站上拉取
  
**网站访问慢原因**：<br>
* 第一次访问慢？CDN没有资源，从源站拉取（预热）<br>
* 不是第一次？<br>
   * 资源访问量比较低，预热不够，cdn收到请求少，无法命中缓存<br>
   * 资源配置时间不合理，频繁回流<br>
   * http header配置导致无法缓存<br>
   * gzip<br>
   * url带有参数，CDN认为是新请求，都会回源，要开启过滤参数<br>
   * 大文件开启range(切片)<br>
   * 资源动静分离，动态资源和静态资源放到不同的域名下<br>
   
**缓存**
* http缓存
* cache(内存缓存)
* dist（service worker）
* push缓存(http2会话之间的缓存)

一个请求回来之后 (网络堆栈)-> http缓存 -> 渲染器的内存缓存(设置cache control，可以缓存) -> disk

**分包**：抽取公共业务包（splitChunks）
* bundle splitting: 创建更多更小的文件，并行加载，只有代码修改了才重新加载，
* code splitting：异步组件

splitChunks.chunks = 'all'：把node_module都放到vendor文件<br>
如果依赖包更新，缓存就会失效<br>
优化：把固定搭配的依赖包分到一起，如基础库，UI库<br>
![](./image/1625309250331.jpg)

**多页 动态组件**
* require.ensure(jsonp)
* react lazy

结合项目，使用preload prefetch
* preconnect:预连接，通过html webpack plugin配置
* preload：请求资源时不会阻塞document渲染，加载当前页面资源
* prefetch:先加载下一个页面的资源，跳过去时不会再请求，直接用


## 2.首屏打开的性能
**FP FCP FMP TTI**
![](./image/1625310621225.jpg)

FP：加载html
```
<div id="app"></div>
```
FCP:有结构，还没填充内容，加载html和js
```
<div id="app">
    <div></div>
    <div></div>
</div>
```
FMP:数据都渲染到页面了，加载html和js，数据请求回来
```
<div id="app">
    <div>11</div>
    <div>222</div>
</div>
```
优化指标：FP,FCP,FMP

**预渲染和SSR区别？**
* 预渲染时本地构建时通过无头浏览器构建
* SSR:react renderToString(jsx应用) -> html
  renderToString:
    server端：先通过模板引擎来处理->构建页面
    client端：用js构建状态，绑定事件 React.hydrate

## 3. react本身应用代码上的一些优化（memo, hooks,lazy）

## 4. 本地构建的优化
CommonsChunkPlugin和splitChunksPlugin区别：<br>
CommonsChunkPlugin：<br>
1.产出的chunk在引用的时候，会包含重复代码<br>
* entryA: vuex vue AComponent
* entryB: vue axios BComponent
* entryC: vue vuex axios CComponent
打包之后的包：
* vendor-chunk:vuex vue axios
* chunkA,chunkB,chunkC:Component（业务代码）
首次访问chunkB时会拉取vendor-chunk，会加载多余的库vuex

2.无法优化异步的chunk
* entryA: vuex vue AComponent
* asyncB: vue axios BComponent   //异步组件
* entryC: vue vuex axios CComponent
打包之后的包：
* vendor-chunk:Component
* chunkA:Component
* asyncB:vue axios BComponent  //异步组件，不提取
* chunkC:axios CComponent

splitChunksPlugin：
抽离代码是有条件的，使用的是自动重复算法，有一个阈值，达到了才会抽离
抽离条件：
* 被共享引用的新代码或者node_module里的代码
* 抽取的公共代码要>=30kb（默认配置）
* 按需加载应用的代码，并行请求的数量不多于5次（可配）
* 初始化加载的代码块，并行请求不多于三次（可配）

DllPlugin:
手动配置，新开一个webpack来构建第三方包

## React Hooks
react16新特性：hooks lazy memo fiber

class类组件
函数组件
hoc高阶组件
render-props:抽离业务逻辑，子组件通过属性传递进来

类组件：
1.状态逻辑复用差，比如处理一个点击事件，首先要在不同的生命周期初始化这个事件，一个单独的业务逻辑被
  不同的生命周期、不同的函数分开，难以复用
  可以通过hoc, render-props来解决该问题，但是嵌套逻辑会很冗余
2.复杂组件难以理解
3.this不好维护，class编译之后的代码太多，
4.热重载的时候会有不稳定的情况

使用useState的变量：存到fiberNode的hook对象上以链表的形式存放

useEffect:
dom操作，浏览器的事件绑定，http请求，io操作都是有副作用的操作，不可控的操作，不能预估的

hooks:
1.只在外层使用，不要再循环、条件判断、子函数中使用
2.useEffect的第二个参数是空数组，相当于componentDidMount