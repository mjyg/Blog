# 手写bind
bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的
一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )
## 第一步
```js
var foo = function() {
  console.log(this);  // {a:1}
  console.log(this.a);
};

var bar = {
  a: 1
};

// var bindBar = foo.bind(bar);
// bindBar(); // 1

Function.prototype.bind2 = function(context) {
  var self = this;
  return function() {
    console.log(this); // window
    self.apply(context);
  };
};

var bind2Bar = foo.bind2(bar);
bind2Bar();  //1
```
## 第二步
* 可以传参
```js
var foo = function(b, c) {
  console.log(this.a, b, c);
};

var bar = {
  a: 1
};

var bindBar = foo.bind(bar, 2);
bindBar(3); // 1 2 3

Function.prototype.bind2 = function(context) {
  var self = this;
  var args = arguments;
  return function() {
    var arr = [];
    for (var i = 1; i < args.length; i++) {
      arr.push(args[i]);
    }
    for (i = 0; i < arguments.length; i++) {
      arr.push(arguments[i]);
    }
    self.apply(context, arr);
  };
};

Function.prototype.bind3 = function(context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments,1);
  return function() {
    self.apply(context, args.concat(Array.prototype.slice.call(arguments)));
  };
};

var bind3Bar = foo.bind3(bar, 2);
bind3Bar(3); //1 2 3
```

# 第三步
* 实现构造函数效果
当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效
```js
var a =99;

var foo = function(b, c) {
  this.name = "Bob";
  console.log(this.a, b, c);
};
foo.prototype.color = "red";

var bar = {
  a: 1
};

var bindBar = foo.bind(bar, 2);
bindBar(10) //1 2 10
var obj = new bindBar(10); //undefined 2 10

console.log(bindBar); //  ƒ (b, c) {this.name = "Bob";console.log(this.a, b, c);}
console.log(typeof bindBar); // function
console.log(typeof obj); //  object


console.log(obj); // foo {name:Bob}
console.log(obj.__proto__);  // foo.prototype {color:red}
console.log(obj.name); // Bob
console.log(obj.color); // red
```
可以看到，尽管全局和foo中都声明了a值，最后依然返回的是undefined，说明绑定的this失效了，其实new操作
之后，this指向了obj<br>
通过修改返回函数的原型来实现这个特点：
```js
Function.prototype.bind2 = function(context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
  // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，
  // 将 null 改成 this ，实例会具有 a 属性
  // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
  var fBound = function() {
    console.log(this); // foo {}
    self.apply(
      this instanceof fBound ? this : context,  //判断如果是new操作需要把this指向原来的foo
      args.concat(Array.prototype.slice.call(arguments))
    );
  };
  fBound.prototype = self.prototype;  // 这一步是为了找到color属性，把返回函数的原型指向foo的原型
  return fBound;
};

var bind2Bar = foo.bind2(bar, 2);
// bind2Bar(10);  // 1 2 10
var obj2 = new bind2Bar(10); //undefined 2 10
console.log(obj2); // foo {name:Bob}
console.log(obj2.__proto__); // foo.prototype {color:red}
console.log(obj2.name); // Bob
console.log(obj2.color); // red
```

# 第四步
* 构造函数的优化实现
直接将 fBound.prototype = this.prototype，我们直接修改 fBound.prototype 的时候，也会直接修改绑定
函数的 prototype<br>
这个时候，可以通过一个空函数来中转：
```js
Function.prototype.bind2 = function(context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
  // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，
  // 将 null 改成 this ，实例会具有 a 属性
  // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
  var fBound = function() {
    console.log(this); // foo {}
    self.apply(
      this instanceof fBound ? this : context,  //判断如果是new操作需要把this指向原来的foo
      args.concat(Array.prototype.slice.call(arguments))
    );
  };
  var temp = function(){};
  temp.prototype = self.prototype;
  fBound.prototype = new temp();  // 这一步是为了找到color属性，把返回函数的原型指向foo的原型
  return fBound;
};
```
❀ 参考文章：[JavaScript深入之bind的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)
