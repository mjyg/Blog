# Webpack5输出文件分析
**目录**
> * [单文件分析](#单文件分析)
> * [多文件引用分析](#多文件引用分析)
> * [异步文件引用分析](#异步文件引用分析)

## 单文件分析
首先创建src/index.js:
```javascript
let result = '你好'
console.log(result)
```
使用webpack打包命令：`webpack --mode development`<br>
生成main.js如下：
```javascript
(() => {
  eval(
    'let result = "你好";\nconsole.log(result);\n\n\n//# sourceURL=webpack://webpack5/./src/index.js?'
  );
})();
```
可以看到就是一个立即执行函数，和webpack4比较没有了传参的过程
## 多文件引用分析
修改src/index.js:
```javascript
import data from './data'
let result = '你好'
console.log('', data)
console.log(result)
```
创建src/data.js:
```javascript
const data = '外部数据'
export default data
```
执行`webpack --mode development`，生成打包文件main.js，简化后如下：
```javascript
(() => {
  "use strict";
  var __webpack_modules__ = {
    "./src/data.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.d(__webpack_exports__, {
        default: () => __WEBPACK_DEFAULT_EXPORT__,
      });
      const data = "外部数据";
      const __WEBPACK_DEFAULT_EXPORT__ = data;
    },

    "./src/index.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        "./src/data.js"
      );
      let result = "你好";
      console.log("", _data__WEBPACK_IMPORTED_MODULE_0__.default);
      console.log(result);
    },
  };

  // The module cache
  var __webpack_module_cache__ = {};

  // The require function
  function __webpack_require__(moduleId) {
    // 检查缓存
    if (__webpack_module_cache__[moduleId]) {
      return __webpack_module_cache__[moduleId].exports;
    }
    //创建一个新的缓存
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  /* webpack/runtime/define property getters */
  (() => {
    // define getter functions for harmony exports
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();

  /* webpack/runtime/hasOwnProperty shorthand */
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  /* webpack/runtime/make namespace object */
  (() => {
    // define __esModule on exports
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();

  //执行入口文件
  __webpack_require__("./src/index.js");
  // This entry module used 'exports' so it can't be inlined
})();
```
和[webpack4](../webpack4/output-file-analysis.md)比较：
* 所有的函数改成箭头函数
* 改变了传统的传值方式，把依赖的文件从闭包的参数变成了闭包内部的私有变量，减少了查询依赖的时间

## 异步文件引用分析
创建文件src/index.js:
```js
import("./async").then((_) => {
  console.log(_);
});
```
创建文件src/async.js:
```js
const data2 = '异步数据'
export default data2
```
用webpack编译后生成main.js和src_async_js.main.js<br>
先看main.js,简化后如下:<br>
![](/assets/webpack/webpack5-code.png)<br>
先看这块比webpack4主程序多出来的代码：
```js
  var jsonpArray = (window["webpackJsonpwebpack5"] =
     window["webpackJsonpwebpack5"] || []);
   var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
   jsonpArray.push = webpackJsonpCallback;
   var parentJsonpFunction = oldJsonpFunction;
```
这里和webpack4逻辑一样，不记得的话，可以再看看[Webpack4输出文件分析](../webpack4/output-file-analysis.md)，
只不过window["webpackJsonp"]变成了window["webpackJsonpwebpack5"]<br>
再来看比webpack4多出来的__webpack_require__.e方法：
```js
__webpack_require__.e = (chunkId) => {
      return Promise.all(
        Object.keys(__webpack_require__.f).reduce((promises, key) => {
          __webpack_require__.f[key](chunkId, promises);
          return promises;
        }, [])
      );
    };
```
这段代码中，webpack为每一个异步模块都分配了一个 id，并维护了一个全局对象 installedChunks 用于存放
异步加载模块的信息，该例中如下：
```js
{
  main: 0,
  0: [resolve Function, reject Function, Promise]
}
```
该对象的值对应多种：
>* undefined: 未加载
>* null: preloaded 或 prefetched 的模块
>* 数组: 结构为 [resolve Function, reject Function, Promise] 的数组, 代表 chunk 在处于加载中. 
Promise 代表这个加载行为，resolve Function 和 reject Function 分别可以 resolve 和 reject 这个 
Promise
>* 0: 已加载<br>

接着为0.js创建一个script标签，插入到页面中，即执行0.js<br>
下面再看第二个打包出来的文件0.js:
```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [0],
  {
    "./src/async.js": function (
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      "use strict";
      const data2 = "异步数据";
      __webpack_exports__["default"] = data2;
    },
  },
]);
```
原来在这里window["webpackJsonp"] 的 push 方法 (webpackJsonpCallback) 被调用了，下面再看webpackJ
sonpCallback方法：
```js
// webpackBootstrap
  // install a JSONP callback for chunk loading
  //传入参数data:[
  //   [0],
  //   {
  //     "./src/async.js": function (
  //       module,
  //       __webpack_exports__,
  //       __webpack_require__
  //     ) {
  //       "use strict";
  //       const data2 = "异步数据";
  //       __webpack_exports__["default"] = data2;
  //     },
  //   },
  // ]
  function webpackJsonpCallback(data) {
    var chunkIds = data[0];  //取出模块id：[0]
    var moreModules = data[1]; //取出模块：{"./src/async.js": function}

    // add "moreModules" to the modules object,
    // then flag all "chunkIds" as loaded and fire callback
    // 标记所有 chunk 为已加载
    var moduleId,
      chunkId,
      i = 0,
      resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (
        Object.prototype.hasOwnProperty.call(installedChunks, chunkId) &&
        installedChunks[chunkId]
      ) {
        resolves.push(installedChunks[chunkId][0]);// 前文中提到的 resolve Function
      }
      installedChunks[chunkId] = 0;// 并标记所有 chunk 为已加载
    }

    // 把所有的模块加入 modules 的对象中, 没错就是 __webpack_require__.m 对应的那个属性
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        //这里把{async.js:function}对象加入到modules中
        modules[moduleId] = moreModules[moduleId];
      }
    }
    // 执行一下原来的 push 函数
    if (parentJsonpFunction) parentJsonpFunction(data);

    // resolve 此模块的 chunk 对应的 Promise.
    while (resolves.length) {
      resolves.shift()();
    }
  }
```
可以看到webpackJsonpCallback 函数的执行会把模块的内容被插入到 __webpack_require__.m 中（即modules），
并 resolve 此模块加载的 Promise。就这样异步模块和同步模块一样, 被加载到了 __webpack_require__.m 
这个对象中了，接着只需要对其调用__webpack_require__函数就可以按照同步模块的 load 流程进行初load了<br>

☆本文完整demo见[asyncDemo](/webpack/webpack4/asyncDemo)<br>