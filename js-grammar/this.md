# this
this指向函数运行（调用）时所在的执行环境<br>
即谁调this，this指谁<br>
🌰例1
```js
var obj = {
    a: function() {
        console.log(this);
    }
}
obj.a() //{a: ƒ}
var b = obj.a;
b(); // window
```
## setTimeout
超时调用（setTimeout回调）的代码都是在全局作用域环境中执行的，因此（setTimeout回调）函数中this的值
在非严格模式下指向window对象，在严格模式下是undefined<br>
超时调用（setTimeout回调）的代码都是在全局作用域环境中执行的，因此（setTimeout回调）函数中this的值
在非严格模式下指向window对象，在严格模式下是undefined<br>
🌰例2
```js
function foo() {
    console.log("id1:", this.id);
    console.log("this1:", this);
    setTimeout(function() {
        console.log("id2:", this.id);
        console.log("this2:", this);
    }, 0);
}

var id = 21;

foo();

// Chrome
// id1: 21
// this1: window
// id2: 21
// this2: window

foo.call({id: 42});

// Chrome
// id1: 42
// this1: {id: 42}
// id2: 21
// this2: window
```
## 箭头函数
箭头函数根本没有自己的this，导致内部的this指向了外层代码的this，这个指向在**定义时就已经确定**而不会在调用
时指向其执行环境的（变量）对象<br>
因为箭头函数内部的this是指向外层代码块的this的，所以我们可以通过**改变外层代码块的this的指向从而改变箭头函数中this的指向**<br>
🌰例3
```js
function foo() {
    console.log("id1:", this.id);
    console.log("this1:", this);
    setTimeout(() => {
        console.log("id2:", this.id);
        console.log("this2:", this);
    }, 0);
}

var id = 21;

foo();

// Chrome
// id1: 21
// this1: window
// id2: 21
// this2: window

foo.call({id: 42});

// Chrome
// id1: 42
// this1: {id: 42}
// id2: 42
// this2: {id: 42}
```
因为箭头函数（setTimeout回调）没有自己的this，导致其内部的this引用了外层代码块的this，即foo函数的this<br>
（要注意：在定义阶段（调用函数前），foo函数的this的值并不确定，但箭头函数的this自定义阶段开始就指向foo函数的this了）<br>
又因为使用call方法改变了foo函数运行（调用）时其函数体内this的指向（重新指向对象{id: 42}）从而使箭头
函数中this的指向发生变化，最后输出例3所示结果。<br>

## 进阶
🌰例4
```
this.a = 20;
function go() {
  console.log(this.a);  
  this.a = 30; //这句把window.a从20变成30
}
go.prototype.a = 40;
var test = {
  a: 50,
  init: function (fn) {
    fn();
    return fn;
  },
};
console.log("实例", (new go()).a);  // 40（还未执行到this.a=30，从原型链上找）  实例30（构造函数上的this.a优先级比原型链高）
test.init(go); // 20 （这里的执行之前window.a=20,执行完后把window.a从20变成30）
var p = test.init(go);// 30  （这里是window.a=30）
p(); //30   （这里是window.a=30）
```
🌰例5
```js
this.a = 20;
var test = {
  a: 50,
  init: () => {
    console.log('out', this)
    function go() {
      console.log('inner', this)
      console.log(this.a);
    }
    go();
  },
};
test.init()  // window window 20

this.a2 = 20;
var test2 = {
  a2: 50,
  init: function(){
    console.log('out', this)
    function go2() {
      console.log('inner', this)
      console.log(this.a2);
    }
    go2();
  },
};
test2.init();  // {a2:50,init:f} window 20

this.a3 = 20;
var test3 = {
  a3: 50,
  init(){
    console.log('out', this)
    function go3() {
      console.log('inner', this)
      console.log(this.a3);
    }
    go3();
  },
};
test3.init();  // {a2:50,init:f} window 20

this.a4 = 20;
var test4 = {
  a4: 50,
  init: () => {
    console.log('out', this)
    var go4 =() =>  {
      console.log('inner', this)
      console.log(this.a4);
    }
    go4();
  },
};
test4.init() // window window 20

this.a5 = 20;
var test5 = {
  a5: 50,
  init: function(){
    console.log('out', this)
    var go5 =() =>  {
      console.log('inner', this)
      console.log(this.a5);
    }
    go5();  // {a5:50,init:f} {a5:50,init:f} 50
  },
};
test5.init();

this.a6 = 20;
var test6 = {
  a6: 50,
  init(){
    console.log('out', this)
    var go6 =() =>  {
      console.log('inner', this)
      console.log(this.a6);
    }
    go6();
  },
};
test6.init(); // {a6:50,init:f} {a6:50,init:f} 50
```
❀ 参考文章：[ES6箭头函数体中的this指向哪里](https://segmentfault.com/a/1190000014027459)
