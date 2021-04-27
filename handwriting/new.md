# 手写new操作符
## 第一版
new实现的功能:
* 可以访问到构造函数里的属性
* 可以访问到构造函数的原型中的属性
如下例:
```js
function Person(name) {
  this.name = name;
  this.age = 20;
}

Person.prototype.sayName = function () {
  return this.name;
};

const p = new Person("Alice");

console.log(p.name); //Alice
console.log(p.age); //20
console.log(p.sayName()); //Alice


function myNew() {
  let obj = {};
  const constructor = [].shift.apply(arguments);
  obj.__proto__ = constructor.prototype; //将 obj 的原型指向构造函数的原型，这样 obj 就可以访问到构造函数原型中的属性
  constructor.apply(obj, arguments) //构造函数的this指向返回对象,并把参数传入构造函数
  return obj
}

const p2 = myNew(Person)
console.log(p.name); //Alice
console.log(p.age); //20
console.log(p.sayName()); //Alice

```

## 第二版
实现返回值:
* 当构造函数返回值为一个对象时,只能访问该返回对象里的属性
```js
function Person(name) {
  this.name = name;
  this.age = 20;
  return {
    name: "Bob",
    sex: "man",
  };
}

Person.prototype.sayName = function () {
  return this.name;
};

const p = new Person("Alice");

console.log(p.name); //Bob
console.log(p.sex); //man
console.log(p.age); //undefined
console.log(p.sayName()); //p.sayName is not a function
```
* 当构造函数返回值为一个基本数据类型时,效果和没有返回值一样,依然能访问构造函数和构造函数原型里的属性
```js
function Person(name) {
  this.name = name;
  this.age = 20;
  return "";
}

Person.prototype.sayName = function () {
  return this.name;
};

const p = new Person("Alice");

console.log(p.name); //Alice
console.log(p.age); //20
console.log(p.sayName()); //Alice
```
最终版:改造一下构造函数返回值,确保构造器总是返回一个对象:
```js
function myNew() {
  let obj = {};
  const constructor = [].shift.apply(arguments);
  obj.__proto__ = constructor.prototype; //将 obj 的原型指向构造函数的原型，这样 obj 就可以访问到构造函数原型中的属性
  const re = constructor.apply(obj, arguments) //构造函数的this指向返回对象,并把参数传入构造函数
  return typeof re === "object" ? re || obj : obj; //判断构造函数返回结果是否是对象,确保构造器总是返回一个对象
}
```
❀ 参考文章：[JavaScript深入之new的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)
