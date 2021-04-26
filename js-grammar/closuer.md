# 闭包
* 闭包是指那些能够访问自由变量的函数。
* 自由变量是指在函数中使用的，但既不是函数参数也不是函数的局部变量的变量。
例1
```js
function Foo() {
  var i = 0;
  return function() {
    console.log(i++);
  }
}

var f1 = Foo(),
  f2 = Foo();  // 
f1();  //0
f1();  //1  //f1引用的变量i是同一变量
f2();  //0  和f1引用的变量i是不同的变量
```
例2
```js
var i = 0;
function Foo() {
  return function() {
    console.log(i++);
  }
}

var f1 = Foo(),
  f2 = Foo();
f1();  //0
f1();  //1
f2();  //2  都引用的是同一个全局遍历i
```
