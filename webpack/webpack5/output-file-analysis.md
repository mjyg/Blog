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
按照执行顺序,再来看比webpack4多出来的__webpack_require__.e方法：
```js
// This file contains only the entry chunk.
// The chunk loading function for additional chunks
__webpack_require__.e = (chunkId) => {
  return Promise.all(
    Object.keys(__webpack_require__.f).reduce((promises, key) => {
      //这里调用__webpack_require__.f.j('src_async_js', []),
      __webpack_require__.f[key](chunkId, promises);
      return promises;
    }, [])
  );
};
```
在这个方法中，对__webpack_require__.f里的key做了reduce处理，这里__webpack_require__.f只有一个key为j,
即调用了__webpack_require__.f.j('src_async_js', []),再来看__webpack_require__.f.j：
```js
 // 参数：'src_async_js'，[]
__webpack_require__.f.j = (chunkId, promises) => {
  // JSONP chunk loading for javascript
  //判断该installedChunks中该trunk的值，这里是undefined，并未加载
  var installedChunkData = __webpack_require__.o(installedChunks, chunkId)
    ? installedChunks[chunkId]
    : undefined;
  if (installedChunkData !== 0) {
    // 0 means "already installed".
    // a Promise means "currently loading".
    if (installedChunkData) {
      promises.push(installedChunkData[2]);
    } else {
      if (true) {
        // all chunks have JS
        // setup Promise in chunk cache
        var promise = new Promise((resolve, reject) => {
          //这里把src_async.js加入installedChunks
          //installedChunks['src_async.js'] = [resolve, reject]}
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        //installedChunks['src_async.js'] = [resolve, reject, promise]}
        promises.push((installedChunkData[2] = promise));

        // start chunk loading
        var url = __webpack_require__.p + __webpack_require__.u(chunkId);
        // create error before stack unwound to get useful stacktrace later
        var error = new Error();
        var loadingEnded = (event) => {
          if (__webpack_require__.o(installedChunks, chunkId)) {
            installedChunkData = installedChunks[chunkId];
            if (installedChunkData !== 0)
              installedChunks[chunkId] = undefined;
            if (installedChunkData) {
              var errorType =
                event && (event.type === "load" ? "missing" : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message =
                "Loading chunk " +
                chunkId +
                " failed.\n(" +
                errorType +
                ": " +
                realSrc +
                ")";
              error.name = "ChunkLoadError";
              error.type = errorType;
              error.request = realSrc;
              installedChunkData[1](error);
            }
          }
        };
        __webpack_require__.l(url, loadingEnded, "chunk-" + chunkId);
      } else installedChunks[chunkId] = 0;
    }
  }
};
```
在这个方法中最重要的是在全局对象installedChunks中存放了异步加载模块的信息，通过这一步，installedChunks
值为：
```js
{
  main: 0,
  'src_async.js': [resolve Function, reject Function, Promise]
}
```
在这个方法中还调用了 __webpack_require__.l 完成src_async_js.main.js插入到html中：
```js
// loadScript function to load a script via script tag
__webpack_require__.l = (url, done, key) => {
  if (inProgress[url]) {
    inProgress[url].push(done);
    return;
  }
  var script, needAttach;
  if (key !== undefined) {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var s = scripts[i];
      if (
        s.getAttribute("src") == url ||
        s.getAttribute("data-webpack") == dataWebpackPrefix + key
      ) {
        script = s;
        break;
      }
    }
  }
  if (!script) {
    needAttach = true;
    script = document.createElement("script");

    script.charset = "utf-8";
    script.timeout = 120;
    if (__webpack_require__.nc) {
      script.setAttribute("nonce", __webpack_require__.nc);
    }
    script.setAttribute("data-webpack", dataWebpackPrefix + key);
    script.src = url;
  }
  inProgress[url] = [done];
  var onScriptComplete = (prev, event) => {
    // avoid mem leaks in IE.
    script.onerror = script.onload = null;
    clearTimeout(timeout);
    var doneFns = inProgress[url];
    delete inProgress[url];
    script.parentNode && script.parentNode.removeChild(script);
    doneFns && doneFns.forEach((fn) => fn(event));
    if (prev) return prev(event);
  };
  var timeout = setTimeout(
    onScriptComplete.bind(null, undefined, {
      type: "timeout",
      target: script,
    }),
    120000
  );
  script.onerror = onScriptComplete.bind(null, script.onerror);
  script.onload = onScriptComplete.bind(null, script.onload);
  needAttach && document.head.appendChild(script);
};
```
由此可见，可以说是上面三个方法__webpack_require__.e，__webpack_require__.f.j，__webpack_require__.l 
共同完成了webpack4中__webpack_require__.e所做的事情，可以说是webpack5对webpack4中__webpack_require__.e
这个方法做了拆分<br>
下面看加载src_async_js.main.js：
```js
(window["webpackJsonpwebpack5"] = window["webpackJsonpwebpack5"] || []).push([
  ["src_async_js"],
  {
    "./src/async.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        default: () => __WEBPACK_DEFAULT_EXPORT__,
      });
      const data2 = "异步数据";
      const __WEBPACK_DEFAULT_EXPORT__ = data2;
    },
  },
]);
```
和webpack基本一样，执行了window["webpackJsonpwebpack5"]的push放方法，即执行webpackJsonpCallback：
```js
// install a JSONP callback for chunk loading
//传入参数data:[
//   ['src_async_js'],
//   {
//     "./src/async.js": function
//   },
// ]
function webpackJsonpCallback(data) {
  var chunkIds = data[0];  //['src_async_js']
  var moreModules = data[1];  //{"./src/async.js": function },

  var runtime = data[3];
  // add "moreModules" to the modules object,
  // then flag all "chunkIds" as loaded and fire callback
  var moduleId,
    chunkId,
    i = 0,
    resolves = [];
  for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if (
      //如果已经加载过该chunk,即installedChunks[chunkId]=promise
      __webpack_require__.o(installedChunks, chunkId) &&
      installedChunks[chunkId]
    ) {
      //把promise加进resolve
      resolves.push(installedChunks[chunkId][0]);
    }
    //标记该chunk为已加载状态
    installedChunks[chunkId] = 0;
  }
  for (moduleId in moreModules) {
    if (__webpack_require__.o(moreModules, moduleId)) {
      //这里把{async.js:function}__webpack_modules__中
      __webpack_require__.m[moduleId] = moreModules[moduleId];
    }
  }
  if (runtime) runtime(__webpack_require__);
  if (parentJsonpFunction) parentJsonpFunction(data);

  // resolve 此模块的 chunk 对应的 Promise.
  while (resolves.length) {
    resolves.shift()();
  }
}
```
该函数和webpack4也基本一致<br>

📚 总结，对于异步文件引用webpack5和webpack4不同点在于：
> * window上挂载的用于存放webpack打包的json变量名由webpackJsonp变成了webpackJsonpwebpack5，多了
    webpack5后缀
> * __webpack_require__.e方法（用来维护存放异步加载模块installedChunks和生成并插入chunk到html中）
   在webpack5中被拆成了三个方法，结构更加清晰

⭐️ 本文完整demo见[asyncDemo](/webpack/webpack5/asyncDemo)<br>