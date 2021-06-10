# JS元编程
引自MDN：从ECMAScript 2015 开始，JavaScript 获得了 Proxy 和 Reflect 对象的支持，允许你拦截并定义基本语言
操作的自定义行为（例如，属性查找，赋值，枚举，函数调用等）。借助这两个对象，你可以在 JavaScript 元级别
进行编程。                                 

* 类型转换时拦截获取原始值的方法「Symbol.toPrimitive]
例1：
```js
var a = {
  [Symbol.toPrimitive]: ((i) => () => ++i)(0),
};

if (a == 1 && a == 2 && a == 3) {
  console.log("执行");
}
```
例2：
```js
let obj = {
  // 运算的时候，toPrimitive会接受一个字符串的参数，表示运算的模式
  [Symbol.toPrimitive](hint) {
    console.log(hint)  // number
    switch (hint) {
      case "number":
        return 123;
      case "string":
        return "str";
      case "default":
        return "default";
      default:
        throw new Error("");
    }
  },
};

console.log(2 * obj);  // number 246
console.log('aa_' + obj);  //default aa_default
```

* Proxy和Reflect
例：生成树形结构
```js
function Tree(){
  return new Proxy({}, handler)
}

const handler={
  get(target, key, receiver){
    if(!(key in target)){
      target[key]= Tree()
    }
    return Reflect.get(target, key,receiver)
  }
}

let tree = Tree()
tree.a.b.c=1
console.log(tree)  // { a: { b: { c: 1 } } }
```
换一种写法：
```js
function Tree() {
  const proxy = new Proxy({}, {
      get(target, key) {
        target[key] = Tree();
        return target[key];
      },
    }
  );

  return proxy;
}

let tree = Tree();
tree.a.b.c = 1;
console.log(tree); // { a: { b: { c: 1 } } }
```