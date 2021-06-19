//webpack编译多文件
//一个闭包函数，以对象{文件：文件的eval函数}为参数
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
    console.log("", _data__WEBPACK_IMPORTED_MODULE_0__["default"]);
    console.log(result);
    console.log("", _data__WEBPACK_IMPORTED_MODULE_0__["default"]);
  },
});
