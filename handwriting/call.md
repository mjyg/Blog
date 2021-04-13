```js
//一.手写call
const foo = {
  value: 1,
};
//
function bar(name, age) {
  console.log(this.value, name, age);
}
//
// bar.call(foo, 'Alice', 10);
/*
//试想当调用 call 的时候，把 foo 对象改造成如下：
var foo2 = {
  value: 1,
  bar: function() {
    console.log(this.value);
  },
};
foo2.bar(); // 1,这个时候 this 就指向了 foo
*/

//第一步
Function.prototype.call1 = function(context) {
  context.fn = this;
  context.fn();
  delete context.fn;
};

// bar.call1(foo)


//第二步:加上参数
Function.prototype.call2 = function(context) {

  //获取参数
  let args = []
  for(let i = 1; i < arguments.length; i ++) {
    args.push('arguments[' + i + ']')
  }
  context.fn = this;

  eval('context.fn('+args + ')');  //执行方法
  delete context.fn;
};

// bar.call2(foo, 'Alice', 10);  //1 Alice 10

//第三步：this 参数可以传 null，当为 null 的时候，视为指向 window
 var AAA = 3;   //或AAA = 3都会挂到xindow对象上

Function.prototype.call3 = function(context) {
  context = context || window

  //获取参数
  let args = []
  for(let i = 1; i < arguments.length; i ++) {
    args.push('arguments[' + i + ']')
  }
  context.fn = this;

  eval('context.fn('+args + ')');  //执行方法
  delete context.fn;
};

function bar3(name, age) {
  console.log(this.AAA);
}
bar3.call3(null);  //3


//二.手写apply
Function.prototype.apply1 = function(context) {
  context = context || window

  //获取参数
  let args = []
  if(arguments[1]) {
    for (let i = 1; i < arguments[1]; i++) {
      args.push('arguments[' + i + ']')
    }
  }
  context.fn = this;

  eval('context.fn('+args + ')');  //执行方法
  delete context.fn;
};

bar.apply1(foo, [])

```
