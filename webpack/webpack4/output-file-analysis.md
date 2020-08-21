# Webpack4输出文件分析
**❀目录❀**
> * [单文件分析](#单文件分析)
> * [多文件引用分析](#多文件引用分析)
***
## 单文件分析
首先创建src/index.js:
```javascript
let result = '你好'
console.log(result)
```
使用webpack打包命令：`webpack --mode development`<br>
☆tip:
本例中使用的webpack版本为4.44.1，此处为了更好的分析输出的bundle文件，将mode设置为'development'。<br>
mode有三个可选值，分别是'none'、'production'、'development'，默认值为'production'<br>
mode值为'production'默认开启以下插件：
* FlagDependencyUsagePlugin：编译时标记依赖；
* FlagIncludedChunksPlugin：标记子chunks，防止多次加载依赖；
* ModuleConcatenationPlugin：作用域提升(scope hosting)，预编译功能，提升或者预编译所有模块到一个闭包中，提升代码在浏览器中的执行速度；
* NoEmitOnErrorsPlugin：在输出阶段时，遇到编译错误跳过；
* OccurrenceOrderPlugin：给经常使用的ids更短的值；
* SideEffectsFlagPlugin：识别 package.json 或者 module.rules 的 sideEffects 标志（纯的 ES2015 模块)，安全地删除未用到的 export 导出；
* TerserPlugin：压缩代码<br>
mode值为'development'时，默认开启以下插件：
* NamedChunksPlugin：以名称固化chunkId；
* NamedModulesPlugin：以名称固化moduleId<br>
mode值为'none'时，不开启任何插件<br>
输出到dist文件夹中的 main.js,简化后文件内容如下：
```javascript
//webpack编译单文件
//一个IIFE（立即执行函数，避免函数执行时里面的变量和外面的冲突)，以对象{入口文件：入口文件的eval函数}为参数
(function (modules) {
  //模块缓存
  var installedModules = {};

  //加载模块
  function __webpack_require__(moduleId) {
    // 如果已经加载过该模块，则从缓存中直接读取
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }

    // 如果没有加载过该模块，则创建一个新的module存入缓存中
    var module = (installedModules[moduleId] = {
      exports: {},
    });

    //执行eval(...)，moduleId是入口文件
    // call方法第一个参数为modules.exports，是为了module内部的this指向该模块
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    return module.exports;
  }

  //返回入口执行代码
  return __webpack_require__("./src/index.js");
})({
  "./src/index.js": function (module, exports) {
    eval(
      "let result = '你好'\nconsole.log(result)\n\n//# sourceURL=webpack:///./src/index.js?"
    );
  },
});
```
简化后代码中的 **__webpack_require__** 函数起到的就是加载模块的功能，IIFE函数接收的参数是个数组，第0项内容便是 src/index.js 中的代码语句，通过 __webpack_require__ 函数加载并执行模块，最终在浏览器控制台输出结果。
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
执行`webpack --mode development`,生成打包文件main.js，简化后如下：
```javascript
//webpack编译多文件
//立即执行函数的参数变成了两项
//webpack把依赖的文件都铺平了，遇到依赖就加到参数中
(function (modules) {
  //模块缓存
  var installedModules = {};

  function __webpack_require__(moduleId) {
    //检查模块缓存
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }

    var module = (installedModules[moduleId] = {
      exports: {},
    });

    //执行eval(...)，moduleId是入口文件
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    return module.exports;
  }

  //返回入口执行代码
  return __webpack_require__("./src/index.js");
})({
  "./src/data.js": function (module, __webpack_exports__, __webpack_require__) {
    const data = "外部数据";
    console.log(data);
    __webpack_exports__["default"] = data; //module.exports['default'] = data
  },
  "./src/index.js": function (
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      "./src/data.js"
    );
    let result = "你好";
    console.log("", _data__WEBPACK_IMPORTED_MODULE_0__.default);
    console.log(result);
  },
});
```
webpack通过将原本独立的一个个模块存放到IIFE的参数中来加载，从而达到只进行一次网络请求便可执行所有模块，避免了通过多次网络加载各个模块造成的加载时间过长的问题。并且在IIFE函数内部，webpack也对模块的加载做了进一步优化，通过将已经加载过的模块缓存起来存在内存中，第二次加载相同模块时便直接从内存中取出。<br>
❀参考链接：[webpack输出文件分析以及编写一个loader](https://juejin.im/post/6844903907810869261)
