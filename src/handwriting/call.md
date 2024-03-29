# 手写call
call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。
## 第一步
原生call:
```js
const bar = {
  value: 1,
};

function foo(name, age) {
  this.fooValue = 'foo value'
  console.log(this.value, name, age);
}

foo.call(bar, 'Alice', 10);
```
试想当调用 call 的时候，把 bar 对象改造成如下：
```js
var bar2 = {
  value: 1,
  foo: function() {
    this.fooValue = 'foo value'
    console.log(this.value);
  },
};
bar2.foo(); // 1 (这个时候 this 就指向了 foo)
console.log('bar2:', bar2)
```
打印如下，可以看到bar2里面有了foo的属性fooValue：<br>
![](image/16206287101980.png)<br>
实现如下：
```js
Function.prototype.call2 = function(bar) {
  console.log(this)  // [Function: foo]
  bar.foo = this;
  bar.foo();  // 注：这里不能写成this(),this会指不到bar;通过这一步bar有了foo的fooValue属性
  delete bar.foo;
};

foo.call2(bar); //1
```

## 第二步
* 加上参数
```js
 const foo = function(b,c) {
   console.log(this.a, b ,c);
 };
 
 const bar = {
   a: 1
 };
 
 foo.call(bar);
 
 Function.prototype.call2 = function(bar) {
   console.log(this);  // [Function: foo]
   bar.foo = this;
 
   // 调用foo的时候把不定参数传进去
   const args = [];
   for(let i = 1; i < arguments.length; i++) {
     args.push(arguments[i]);
   }
   eval("bar.foo(" + args+ ")");  //这里相当于调了args.toString()
   console.log("bar.foo(" + args + ")");  //bar.foo(2,3)
 
   delete bar.foo;
 };
 
 foo.call2(bar, 2,3);  //1 2 3
```

## 第三步
* this 参数可以传 null，当为 null 的时候，视为指向 window
* 函数可以有返回值
```js
 var a = 2;
 const foo = function(b,c) {
   console.log(this.a,b,c);
   return {d:1};
 };
 
 const bar = {
   a: 1
 };
 
 // foo.call(null);
 
 Function.prototype.call2 = function(bar) {
   var context = bar || window;
   context.foo = this;
 
   // 调用foo的时候把不定参数传进去
   const args = [];
   for(let i = 1; i < arguments.length; i++) {
     args.push(arguments[i]);
   }
   var re = eval("context.foo(" + args+ ")");  //这里相当于调了args.toString()
   delete context.foo;
   return re;
 };
 
 foo.call2(null);  //2
 console.log(foo.call2(bar,2,3));  //1 2 3 {d:1}
```

# 手写apply
```js
var a = 2;
const foo = function(b,c) {
  console.log(this.a,b,c);
  return {d:1};
};

const bar = {
  a: 1
};

// foo.call(null);

Function.prototype.apply2 = function(bar, arr) {
  var context = bar || window;
  context.foo = this;

  var re;
  if(!arr) {
    re = context.foo();
  } else {
    const args = [];
    for(let i = 0; i < arr.length; i++) {
      args.push(arr[i]);
    }
    re = eval("context.foo(" + args+ ")");  //这里相当于调了args.toString()
  }

  delete context.foo;
  return re;
};

foo.apply2(null);  //2
console.log(foo.apply2(bar,[3,4]));  //1 3 4 {d:1}
```
❀ 参考文章：[JavaScript深入之call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)
