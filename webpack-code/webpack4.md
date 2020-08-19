# 输出文件分析
## 单文件分析
首先创建src/index.js:
```
let result = '你好'
console.log(result)
```
使用webpack打包命令：webpack --mode development<br>
☆tip:
本例中使用的webpack版本为4.44.1，此处为了更好的分析输出的bundle文件，将mode设置为'development'。<br>
mode有三个可选值，分别是'none'、'production'、'development'，默认值为'production'，
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
简化后代码中的 __webpack_require__ 函数起到的就是加载模块的功能，IIFE函数接收的参数是个数组，第0项内容便是 src/index.js 中的代码语句，通过 __webpack_require__ 函数加载并执行模块，最终在浏览器控制台输出结果。
## 多文件引用分析
修改src/index.js:
