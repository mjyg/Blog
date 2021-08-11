# jQuery源码学习

> * [闭包结构](#闭包结构)
> * [无new构造](#无new构造)
> * [jQuery.fn.extend 与 jQuery.extend](#jQuery-fn-extend与jQuery-extend)
> * [链式调用及回溯](#链式调用及回溯)
> * [变量冲突处理](#变量冲突处理)

虽然jQuery现在已经很少使用了，但是它的源码有很多地方在我们平常写代码时可以学习和借鉴~~

## 闭包结构
```js
// 用一个函数域包起来，就是所谓的沙箱
// 在这里边 var 定义的变量，属于这个函数域内的局部变量，避免污染全局
// 把当前沙箱需要的外部变量通过函数参数引入进来
// 只要保证参数对内提供的接口的一致性，你还可以随意替换传进来的这个参数
(function(window, undefined) {
   // jQuery 代码
})(window);
```
jQuery 具体的实现，都被包含在了一个立即执行函数构造的闭包里面，为了不污染全局作用域，只在后面暴露 $ 
和 jQuery 这 2 个变量给外界，尽量的避开变量冲突。

undefined作为第二个参数，可以确保你需要的 undefined 确实就是 undefined

## 无new构造
使用 jQuery 的时候，实例化一个 jQuery 对象的方法：
```js
// 无 new 构造
$('#test').text('Test');
 
// 当然也可以使用 new
var test = new $('#test');
test.text('Test');
```
当我们使用第一种无 new 构造方式的时候，其本质就是相当于 new jQuery()，那么在 jQuery 内部是如何实现的呢？
```js
(function(window, undefined) {
    var
    // ...
    jQuery = function(selector, context) {
        // The jQuery object is actually just the init constructor 'enhanced'
        // 看这里，实例化方法 jQuery() 实际上是调用了其拓展的原型方法 jQuery.fn.init
        return new jQuery.fn.init(selector, context, rootjQuery);
    },
 
    // jQuery.prototype 即是 jQuery 的原型，挂载在上面的方法，即可让所有生成的 jQuery 对象使用
    jQuery.fn = jQuery.prototype = {
        // 实例化化方法，这个方法可以称作 jQuery 对象构造器
        init: function(selector, context, rootjQuery) {
            // ...
        }
    }
    // 这一句很关键，也很绕
    // jQuery 没有使用 new 运算符将 jQuery 实例化，而是直接调用其函数
    // 要实现这样,那么 jQuery 就要看成一个类，且返回一个正确的实例
    // 且实例还要能正确访问 jQuery 类原型上的属性与方法
    // jQuery 的方式是通过原型传递解决问题，把 jQuery 的原型传递给jQuery.prototype.init.prototype
    // 所以通过这个方法生成的实例 this 所指向的仍然是 jQuery.fn，所以能正确访问 jQuery 类原型上的属性与方法
    jQuery.fn.init.prototype = jQuery.fn;
 
})(window);
```
`jQuery.fn.init.prototype = jQuery.fn` 这一句算是 jQuery 的绝妙之处：

1）首先要明确，使用 $('xxx') 这种实例化方式，其内部调用的是 `return new jQuery.fn.init(selector,
 context, rootjQuery)` 这一句话，也就是构造实例是交给了 `jQuery.fn.init() `方法去完成。

2）将 jQuery.fn.init 的 prototype 属性设置为 jQuery.fn，那么使用 `new jQuery.fn.init()` 生成的对
象的原型对象就是 jQuery.fn ，所以挂载到 jQuery.fn 上面的函数就相当于挂载到 `jQuery.fn.init()` 生成的 
jQuery 对象上，所有使用` new jQuery.fn.init()` 生成的对象也能够访问到 jQuery.fn 上的所有原型方法。

3）也就是实例化方法存在这么一个关系链:  
* `jQuery.fn.init.prototype = jQuery.fn = jQuery.prototype` ;
* `new jQuery.fn.init()` 相当于 `new jQuery() `;
* jQuery() 返回的是 `new jQuery.fn.init()`，而 `var obj = new jQuery()`，所以这 2 者是相当的，所以我们
可以无 new 实例化 jQuery 对象。

## 方法的重载
方法的重载即是一个方法实现多种功能,在平时写代码时可以借鉴这种方式，扩大函数实用性
```js
// 获取 title 属性的值
$('#id').attr('title');
// 设置 title 属性的值
$('#id').attr('title','jQuery');
 
// 获取 css 某个属性的值
$('#id').css('title');
// 设置 css 某个属性的值
$('#id').css('width','200px');
```

##  jQuery.fn.extend与jQuery.extend
* jQuery.extend(object) 为扩展 jQuery 类本身，为类添加新的静态方法；
* jQuery.fn.extend(object) 给 jQuery 对象添加实例方法，也就是通过这个 extend 添加的新方法，实例
化的 jQuery 对象都能使用，因为它是挂载在 jQuery.fn 上的方法（上文有提到，jQuery.fn = jQuery.prototype ）。 

也就是说，使用 jQuery.extend() 拓展的静态方法，我们可以直接使用 $.xxx 进行调用（xxx是拓展的方法名），
而使用 jQuery.fn.extend() 拓展的实例方法，需要使用 $().xxx 调用。
```js
// 扩展合并函数
// 合并两个或更多对象的属性到第一个对象中，jQuery 后续的大部分功能都通过该函数扩展
// 虽然实现方式一样，但是要注意区分用法的不一样，那么为什么两个方法指向同一个函数实现，但是却实现不同的功能呢,
// 阅读源码就能发现这归功于 this 的强大力量
// 如果传入两个或多个对象，所有对象的属性会被添加到第一个对象 target
// 如果只传入一个对象，则将对象的属性添加到 jQuery 对象中，也就是添加静态方法
// 用这种方式，我们可以为 jQuery 命名空间增加新的方法，可以用于编写 jQuery 插件
// 如果不想改变传入的对象，可以传入一个空对象：$.extend({}, object1, object2);
// 默认合并操作是不迭代的，即便 target 的某个属性是对象或属性，也会被完全覆盖而不是合并
// 如果第一个参数是 true，则是深拷贝
// 从 object 原型继承的属性会被拷贝，值为 undefined 的属性不会被拷贝
// 因为性能原因，JavaScript 自带类型的属性不会合并
jQuery.extend = jQuery.fn.extend = function() {
    var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
 
    // Handle a deep copy situation
    // target 是传入的第一个参数
    // 如果第一个参数是布尔类型，则表示是否要深递归，
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        // 如果传了类型为 boolean 的第一个参数，i 则从 2 开始
        i = 2;
    }
 
    // Handle case when target is a string or something (possible in deep copy)
    // 如果传入的第一个参数是 字符串或者其他
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {};
    }
 
    // extend jQuery itself if only one argument is passed
    // 如果参数的长度为 1 ，表示是 jQuery 静态方法
    if (length === i) {
        target = this;
        --i;
    }
 
    // 可以传入多个复制源
    // i 是从 1或2 开始的
    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        // 将每个源的属性全部复制到 target 上
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                // src 是源（即本身）的值
                // copy 是即将要复制过去的值
                src = target[name];
                copy = options[name];
 
                // Prevent never-ending loop
                // 防止有环，例如 extend(true, target, {'target':target});
                if (target === copy) {
                    continue;
                }
 
                // Recurse if we're merging plain objects or arrays
                // 这里是递归调用，最终都会到下面的 else if 分支
                // jQuery.isPlainObject 用于测试是否为纯粹的对象
                // 纯粹的对象指的是 通过 "{}" 或者 "new Object" 创建的
                // 如果是深复制
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                    // 数组
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];
 
                        // 对象
                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }
 
                    // Never move original objects, clone them
                    // 递归
                    target[name] = jQuery.extend(deep, clone, copy);
 
                    // Don't bring in undefined values
                    // 最终都会到这条分支
                    // 简单的值覆盖
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
 
    // Return the modified object
    // 返回新的 target
    // 如果 i < length ，是直接返回没经过处理的 target，也就是 arguments[0]
    // 也就是如果不传需要覆盖的源，调用 $.extend 其实是增加 jQuery 的静态方法
    return target;
};
```
需要注意的是这一句 jQuery.extend = jQuery.fn.extend = function() {} ，也就是 jQuery.extend 的实现和
 jQuery.fn.extend 的实现共用了同一个方法，但是为什么能够实现不同的功能了，这就要归功于 Javascript 强大（怪异？）的 this 了。

1）在 jQuery.extend() 中，this 的指向是 jQuery 对象(或者说是 jQuery 类)，所以这里扩展在 jQuery 上；

2）在 jQuery.fn.extend() 中，this 的指向是 fn 对象，前面有提到 jQuery.fn = jQuery.prototype ，
也就是这里增加的是原型方法，也就是对象方法。

##  链式调用及回溯
jQuery的链式调用，在要实现链式调用的方法的返回结果里，返回 this ，就能够实现链式调用了。

jQuery 还允许回溯，看看：
```js
// 通过 end() 方法终止在当前链的最新过滤操作，返回上一个对象集合
$('div').eq(0).show().end().eq(1).hide();
```
当选择了 ('div').eq(0) 之后使用 end() 可以回溯到上一步选中的 jQuery 对象 $('div')，其内部实现其实
是依靠添加了 prevObject 这个属性：

![](image/608782-20160314191813506-188474195.jpg)

jQuery 完整的链式调用、增栈、回溯通过 return this 、 return this.pushStack() 、
return this.prevObject 实现，看看源码实现：
```js
jQuery.fn = jQuery.prototype = {
    // 将一个 DOM 元素集合加入到 jQuery 栈
    // 此方法在 jQuery 的 DOM 操作中被频繁的使用, 如在 parent(), find(), filter() 中
    // pushStack() 方法通过改变一个 jQuery 对象的 prevObject 属性来跟踪链式调用中前一个方法返回的 DOM 结果集合
    // 当我们在链式调用 end() 方法后, 内部就返回当前 jQuery 对象的 prevObject 属性
    pushStack: function(elems) {
        // 构建一个新的jQuery对象，无参的 this.constructor()，只是返回引用this
        // jQuery.merge 把 elems 节点合并到新的 jQuery 对象
        // this.constructor 就是 jQuery 的构造函数 jQuery.fn.init，所以 this.constructor() 返回一个 jQuery 对象
        // 由于 jQuery.merge 函数返回的对象是第二个函数附加到第一个上面，所以 ret 也是一个 jQuery 对象，这里可以解释为什么 pushStack 出入的 DOM 对象也可以用 CSS 方法进行操作
        var ret = jQuery.merge(this.constructor(), elems);
 
        // 给返回的新 jQuery 对象添加属性 prevObject
        // 所以也就是为什么通过 prevObject 能取到上一个合集的引用了
        ret.prevObject = this;
        ret.context = this.context;
 
        // Return the newly-formed element set
        return ret;
    },
    // 回溯链式调用的上一个对象
    end: function() {
        // 回溯的关键是返回 prevObject 属性
        // 而 prevObject 属性保存了上一步操作的 jQuery 对象集合
        return this.prevObject || this.constructor(null);
    },
    // 取当前 jQuery 对象的第 i 个
    eq: function(i) {
        // jQuery 对象集合的长度
        var len = this.length,
            j = +i + (i < 0 ? len : 0);
 
        // 利用 pushStack 返回
        return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    }, 
}
```
总的来说，

1）end() 方法返回 prevObject 属性，这个属性记录了上一步操作的 jQuery 对象合集；

2）而 prevObject 属性由 pushStack() 方法生成，该方法将一个 DOM 元素集合加入到 jQuery 内部管理的一个栈中，通过改变 jQuery 对象的 prevObject 属性来跟踪链式调用中前一个方法返回的 DOM 结果集合

3）当我们在链式调用 end() 方法后，内部就返回当前 jQuery 对象的 prevObject 属性，完成回溯。

##  变量冲突处理
jQuery 变量的冲突处理，通过一开始保存全局变量的 window.jQuery 以及 windw.$ 。

当需要处理冲突的时候，调用静态方法 noConflict()，让出变量的控制权，源码如下：
```js
(function(window, undefined) {
    var
        // Map over jQuery in case of overwrite
        // 设置别名，通过两个私有变量映射了 window 环境下的 jQuery 和 $ 两个对象，以防止变量被强行覆盖
        _jQuery = window.jQuery,
        _$ = window.$;
 
    jQuery.extend({
        // noConflict() 方法让出变量 $ 的 jQuery 控制权，这样其他脚本就可以使用它了
        // 通过全名替代简写的方式来使用 jQuery
        // deep -- 布尔值，指示是否允许彻底将 jQuery 变量还原(移交 $ 引用的同时是否移交 jQuery 对象本身)
        noConflict: function(deep) {
            // 判断全局 $ 变量是否等于 jQuery 变量
            // 如果等于，则重新还原全局变量 $ 为 jQuery 运行之前的变量（存储在内部变量 _$ 中）
            if (window.$ === jQuery) {
                // 此时 jQuery 别名 $ 失效
                window.$ = _$;
            }
            // 当开启深度冲突处理并且全局变量 jQuery 等于内部 jQuery，则把全局 jQuery 还原成之前的状况
            if (deep && window.jQuery === jQuery) {
                // 如果 deep 为 true，此时 jQuery 失效
                window.jQuery = _jQuery;
            }
 
            // 这里返回的是 jQuery 库内部的 jQuery 构造函数（new jQuery.fn.init()）
            // 像使用 $ 一样尽情使用它吧
            return jQuery;
        }
    })
}(window)
```
那么让出了这两个符号之后，是否就不能在我们的代码中使用 jQuery 或者呢 $ 呢？莫慌，还是可以使用的：
```js
// 让出 jQuery 、$ 的控制权不代表不能使用 jQuery 和 $ ，方法如下：
var query = jQuery.noConflict(true);
 
(function($) {
 
// 插件或其他形式的代码，也可以将参数设为 jQuery
})(query);
 
//  ... 其他用 $ 作为别名的库的代码
```

参考文章：[【深入浅出jQuery】源码浅析--整体架构](https://www.cnblogs.com/coco1s/p/5261646.html)