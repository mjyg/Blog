(function (modules) {
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
  // The module cache
  var installedModules = {};

  // object to store loaded and loading chunks
  // undefined = chunk not loaded, null = chunk preloaded/prefetched
  // Promise = chunk loading, 0 = chunk loaded
  //用于存储已加载和加载中的 chunk, 异步模块在 webpack 中被称为 chunk
  var installedChunks = {
    main: 0,  //0表示已经加载;Promise表示正在加载
  };

  // script path function
  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + "" + ({}[chunkId] || chunkId) + ".js";
  }

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });

    // Execute the module function
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // This file contains only the entry chunk.
  // The chunk loading function for additional chunks
  __webpack_require__.e = function requireEnsure(chunkId) {
    // 声明一个队列，此队列与此 chunk 绑定。
    var promises = [];

    // JSONP chunk loading for javascript
    // 拿到该 chunk 对应的值, 我们这个调用中，显然 installedChunks 里没有0这个 chunk，所以
    // installedChunkData 就是 undefined
    var installedChunkData = installedChunks[chunkId];
    if (installedChunkData !== 0) {
      // 0 means "already installed".
      // a Promise means "currently loading".
      // 如果正在加载
      if (installedChunkData) {
        promises.push(installedChunkData[2]);
      } else {
        // 如果没有加载，(本例的场景), 构造一个 Promise 代表此异步模块的加载结果，并以
        // [resolve, reject, Promise] 这样的结构来存储
        // setup Promise in chunk cache
        var promise = new Promise(function (resolve, reject) {
          //installedChunks[chunkId]等于一个Promise,表示该chunk已经被加载
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        // 将构造的这个 promise 加入队列
        //promises:[promise]
        //installedChunkData:[resolve, reject, promise]
        //installedChunks[0]:[resolve, reject, promise]
        promises.push((installedChunkData[2] = promise));

        // start chunk loading
        //// 开始加载 chunk，通过在页面里插入一个 script 标签来做
        var script = document.createElement("script");
        var onScriptComplete;

        script.charset = "utf-8"; // 设置编码方式
        script.timeout = 120; //设置超时时间,加载异步文件超过120ms就放弃加载，webpack加载超过120ms就报错
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
        }

        // 拼接 chunk 文件的服务器地址
        //例如我这里为src为"http://localhost:63342/8.17webpack/webpack4/src/asyncDemo/dist/0.js"
        script.src = jsonpScriptSrc(chunkId);

        // create error before stack unwound to get useful stacktrace later
        var error = new Error();
        // 定义加载完成的处理函数
        onScriptComplete = function (event) {
          // avoid mem leaks in IE.
          script.onerror = script.onload = null;
          clearTimeout(timeout);// 有结果了，所以清除加载超时的定时器

          // 读出 chunk 的结构
          var chunk = installedChunks[chunkId];
          if (chunk !== 0) {
            if (chunk) {
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
              chunk[1](error); // 这里调用的错误处理函数，也就是说这里是没有加载成功的处理。
            }
            installedChunks[chunkId] = undefined;  //该chunk改为未加载状态
          }
        };

        // 设置超时的处理
        var timeout = setTimeout(function () {
          onScriptComplete({ type: "timeout", target: script });
        }, 120000);
        script.onerror = script.onload = onScriptComplete;
        document.head.appendChild(script); //把0.js追加到页面中，执行0.js
      }
    }
    return Promise.all(promises);  //Promise.all(promises).then返回包含promises里所有元素执行结果的数组
  };

  // expose the modules object (__webpack_modules__)

  __webpack_require__.m = modules; // expose the module cache

  __webpack_require__.c = installedModules; // define getter function for harmony exports

  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter,
      });
    }
  }; // define __esModule on exports

  __webpack_require__.p = ""; // on error function for async loading

  //初始化 window.webpackJsonp 这个对象
  //异步的包需要调用window["webpackJsonp"]进行push
  var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);

  //保存老的jsonpArray.push
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);

  //重写jsonpArray.push为webpackJsonpCallback
  jsonpArray.push = webpackJsonpCallback;

  var parentJsonpFunction = oldJsonpFunction; // Load entry module and return exports

  return __webpack_require__("./src/index.js");
})({
  "./src/index.js": function (module, exports, __webpack_require__) {
    __webpack_require__
      .e(0) //加载0.js并执行
      .then(__webpack_require__.bind(null, "./src/async.js"))//执行0.js里的eval()
      .then((_) => {
        console.log(_);
      });
  },
});
