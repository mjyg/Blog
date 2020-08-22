//webpack编译单文件
//一个闭包函数(避免函数执行时里面的变量和外面的冲突)，以对象{入口文件：入口文件的eval函数}为参数
(function (modules) {
  //模块缓存
  var installedModules = {};

  function __webpack_require__(moduleId) {

    //检查模块缓存
    if(installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }

    var module = installedModules[moduleId] = {
      exports: {}
    };

    //执行eval(...)，moduleId是入口文件
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

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
