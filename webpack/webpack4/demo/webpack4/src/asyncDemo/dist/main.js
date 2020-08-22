(function (modules) {
  // webpackBootstrap
  // install a JSONP callback for chunk loading
  function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1]; // add "moreModules" to the modules object, // then flag all "chunkIds" as loaded and fire callback

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
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        //这里把{async.js:function}对象加入到modules中
        modules[moduleId] = moreModules[moduleId];
      }
    }
    if (parentJsonpFunction) parentJsonpFunction(data);

    while (resolves.length) {
      resolves.shift()();
    }
  } // The module cache

  var installedModules = {}; // object to store loaded and loading chunks // undefined = chunk not loaded, null = chunk preloaded/prefetched // Promise = chunk loading, 0 = chunk loaded

  var installedChunks = {
    main: 0,
  }; // script path function

  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + "" + ({}[chunkId] || chunkId) + ".js";
  } // The require function

  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    } // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    }); // Execute the module function

    console.log('modules:',modules)
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded

    module.l = true; // Return the exports of the module

    return module.exports;
  } // This file contains only the entry chunk. // The chunk loading function for additional chunks

  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = []; // JSONP chunk loading for javascript

    var installedChunkData = installedChunks[chunkId];
    if (installedChunkData !== 0) {
      // 0 means "already installed".

      // a Promise means "currently loading".
      if (installedChunkData) {
        promises.push(installedChunkData[2]);
      } else {
        // setup Promise in chunk cache
        var promise = new Promise(function (resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        promises.push((installedChunkData[2] = promise)); // start chunk loading

        //创建一个script标签
        var script = document.createElement("script");
        var onScriptComplete;

        script.charset = "utf-8";
        script.timeout = 120;  //加载异步文件超过120ms就放弃加载，webpack加载超过120ms就报错
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
        }
        //设置src为"http://localhost:63342/8.17webpack/webpack4/src/asyncDemo/dist/0.js"
        script.src = jsonpScriptSrc(chunkId); // create error before stack unwound to get useful stacktrace later

        var error = new Error();
        onScriptComplete = function (event) {
          // avoid mem leaks in IE.
          script.onerror = script.onload = null;
          clearTimeout(timeout);
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
              chunk[1](error);
            }
            installedChunks[chunkId] = undefined;
          }
        };
        var timeout = setTimeout(function () {
          onScriptComplete({ type: "timeout", target: script });
        }, 120000);
        script.onerror = script.onload = onScriptComplete;
        document.head.appendChild(script);  //把0.js追加到页面中
      }
    }
    return Promise.all(promises);
  }; // expose the modules object (__webpack_modules__)

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

  //对jsonpArray获取window["webpackJsonp"]
  //因为异步的包需要调用window["webpackJsonp"]进行push
  var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
  //保存老的jsonpArray.push
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  //重写jsonpArray.push
  jsonpArray.push = webpackJsonpCallback;

  var parentJsonpFunction = oldJsonpFunction; // Load entry module and return exports

  return __webpack_require__("./src/index.js");
})({
  "./src/index.js": function (module, exports, __webpack_require__) {
    __webpack_require__
      .e(0)  //加载0.js并执行
      .then(__webpack_require__.bind(null, "./src/async.js"))
      .then((_) => {
        console.log(_);
      });
  },
});
