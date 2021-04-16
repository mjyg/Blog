# 变量提升、函数作用域、块级作用域
1. 所有javascript代码执行的时候都默认包裹在一个匿名函数里执行<br>
在浏览器运行以下代码：
```js
function test() {
  debugger;
}
test();
```
查看调用栈可发现外面默认包裹了一个匿名函数<br>
![](image/16185359337709.png)<br>

2.带var的变量提升
```js
if (false) {
  var a = 20;
}
console.log(a);  //undefined
```
打印undefined而不是报错，默认把a的声明提升到了作用预顶端，等同如下
```js
var a;
if (false) {
  a = 20;
}
console.log(a);  //undefined
```

3.函数提升优先级高于var变量提升<br>
例1：
```js
function fun() { }
var fun;
console.log(f);  //ƒ fun() { }
```
例2：
```js
alert(a); // 弹出a的函数定义
a();  //10
var a = 3;

function a() {
  alert(10);
}
alert(a);  //3
a = 6;
a();  // a is not a function
```
例3：
```js
function fun() {
    console.log(1);
}
function init() {
    console.log(fun);//undefined
    if (false) {
        function fun() {
            console.log(2);
        }
    }
    console.log(fun); //undefined 提升了fun的定义，很熟声明未提升
}
fun();//1
init();
```
4.函数作用域
```js
var a;
console.log(a);  //undefined
a = 20;
function init() {
  //js private 私有变量
  var a = 30;
  console.log(a) //30  函数作用域：a的声明只能提升到init函数内部的顶端
}
init();
console.log(a);  //20
```
