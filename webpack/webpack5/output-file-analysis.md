# Webpack5输出文件分析
**目录**<br>
[TOC]
***
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