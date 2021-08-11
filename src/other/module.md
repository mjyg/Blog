# 写一个适应所有环境的JS模块

在ES6以前，JS语言没有模块化，如何让JS不止运行在浏览器，且能更有效的管理代码，于是应运而生CommonJS这种
规范，定义了三个全局变量：`require，exports，module`
* require 用于引入一个模块
* exports 对外暴露模块的接口，可以是任何类型, 
* module 是这个模块本身的对象
 
Node.js 使用了CommonJS规范,用require引入时获取的是这个模块对外暴露的接口（exports）:
```js
var foo = require('foo');

var out = foo.bar();

module.exports = out;
```

在浏览器端，不像Node.js内部支持CommonJS，如何进行模块化，
于是出现了 CMD 与 AMD 两种方式，其主要代表是 seajs 和 requirejs，
他们都定义了一个全局函数 define 来创建一个模块：
```js
// CMD
define(function(require, exports, module) {
  var foo = require('foo');
  var out = foo.bar();
  module.exports = out;
})

// AMD
define(['foo'], function(foo) {
  var out = foo.bar();
  return out;
});
```
可以看出CMD完好的保留了CommonJS的风格，
而AMD用了一种更简洁的依赖注入和函数返回的方式实现模块化。
两者除风格不同外最大区别在于加载依赖模块的方式，
CMD是懒加载，在require时才会加载依赖，
而AMD是预加载，在定义模块时就提前加载好所有依赖。

我们要实现一个模块，让它既能在seajs（CMD）环境里引入，又能在requirejs（AMD）环境中引入，
当然也能在Node.js（CommonJS）中使用，另外还可以在没有模块化的环境中用script标签全局引入，

* 首先一个模块看起来应该是这样：
```js
var moduleName = {};
return moduleName;
```
当然，模块输出的不止可以是对象，还是可以是任何值，包括一个类。

* 分析CMD和AMD，我们需要提供一个工厂函数传入define来定义模块，所以变成这样：
```js
function factory () {
  var moduleName = {};
  return moduleName;
}
```

* 为适应Node.js，可以来判断全局变量，由于require在CMD和ADM中都有定义，所以只判断：
```js
typeof module !== 'undefined' && typeof exports === 'object'
```

于是变成这样：
```js
function factory () {
  var moduleName = {};
  return moduleName;
}

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = factory()
}
```

至此已经能够满足Node.js的需求。

* 没有上述全局变量，且有define全局变量时，我们认为是AMD或CMD，可以直接将factory传入define：
```js
function factory () {
  var moduleName = {};
  return moduleName;
}

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = factory()
} else if (typeof define === 'function' && (define.cmd || define.amd)) {
  define(factory)
}
```
注意：CMD其实也支持return返回模块接口，所以两者可以通用。

* 最后是script标签全局引入，我们可以将模块放在window上,为了模块内部在浏览器和Node.js中都能使用全局对
象，我们可以做此判断：
```js
var global = typeof window !== 'undefined' ? window : global;
```

同时，我们用一个立刻执行的闭包函数将所有代码包含，来避免污染全局空间，
并将global对象传入闭包函数，最终变成这样：
```js
;(function (global) {
  function factory () {
    var moduleName = {};
    return moduleName;
  }
  
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = factory()
  } else if (typeof define === 'function' && (define.cmd || define.amd)) {
    define(factory)
  } else {
    global.moduleName = factory();
  }
})(typeof window !== 'undefined' ? window : global);
```
注意：闭包前加上分号是为了给前一个模块填坑，分号多了没问题，少了则语句可能发生变化。

* 我们参考一下Vuex的源码：
```js
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.Vuex = factory());
}(this, (function () {
  'use strict';
  // ……
  var index = {
    Store: Store,
    install: install,
    version: '2.5.0',
    mapState: mapState,
    mapMutations: mapMutations,
    mapGetters: mapGetters,
    mapActions: mapActions,
    createNamespacedHelpers: createNamespacedHelpers
  };
  return index;
})));
```

这里有两个变化：
函数factory以匿名函数的方式引入，结构从;()(); 变成 ;(()());；
用this代替了typeof window !== 'undefined' ? window : global，this在浏览器是window，在Node中是golbal，很是精妙。

* 稍微简化一下：
```js
;(function (flobal, factory) {
  typeof module !== 'undefined' && typeof exports === 'object' ? module.exports = factory() :
  typeof define === 'function' && (define.cmd || define.amd) ? define(factory) :
  (global.moduleName = factory());
}(this, (function () {
    var index = {};
    return index;
  }
)));
```

* 于是同一个js文件我们能愉快的在不同环境这样引入：
```
// Node.js
var myModule = require('moduleName');

// Seajs
define(function (require, exports, module) {
  var myModule = require('moduleName');
})

// Requirejs
define(['moduleName'], function (moduleName) {
})

// Browser global
<script src="moduleName.js"></script>
```

参考文章：[写一个适应所有环境的JS模块](https://www.jianshu.com/p/30f53349a1c4)