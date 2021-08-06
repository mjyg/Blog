# Reflect

**目录**
> * [定义](#定义)
> * [静态方法](#静态方法)
>   * [get](#get)
>   * [set](#set)
>   * [has](#has)
>   * [deleteProperty](#deleteProperty)
>   * [construct](#construct)
>   * [apply](#apply)
>   * [ownKeys](#ownKeys)
> * [实现观察者模式](#实现观察者模式)


## 定义
Reflect对象引入目的：
* 1.原本属于Object对象内部方法一些方法放到Reflect上，如Object.defineProperty
* 2.修改某些object对象的返回结果，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出
  一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
* 3.让Object的命令式操作变成函数行为，如name in obj和delete obj[name]，而Reflect.has(obj, name)
  和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
* 4.Reflect的方法和Proxy的方法一一对应，使用Proxy时可以调用对应的Reflect方法完成默认行为，作为修改行为
 的基础
 
## 静态方法

### get
get(target, name, receiver):查找并返回target对象的name属性,如果name属性部署了getter,则读取函数
的this绑定receiver
```js
let obj = {
  a: 1,
  b: 3,
  get c () {
    return this.a + this.b;
  },
};
let obj2 = {
  a:3,
  b:4,
};
console.log(Reflect.get(obj, 'c'));  //4
console.log(Reflect.get(obj, 'c', obj2)); //7
```

### set
set(target, name, value, receiver):设置target对象的name属性值为value,如果name属性部署了setter
方法，则设置receiver对象的name属性值
```js
let obj3 = {
  a: 2,
  set setA(value) {
    this.a = value;
  }
};
let obj4 = {
  a:3,
};``

Reflect.set(obj3, 'setA', 5);
console.log(obj3.a); //5

Reflect.set(obj3, 'setA', 8, obj4);
console.log(obj3.a, obj4.a);//5  8
```

### has
has(obj,name): 判断obj里是否存在name属性，类似in运算符
```js
console.log(Reflect.has(obj3, 'a'));//true
```

### deleteProperty
deleteProperty(obj,name):删除obj里的name属性，类似delete运算符
```js
Reflect.deleteProperty(obj3, 'a');
```

### construct
construct(target, args):不使用new来调用构造函数，等同于 new target(args)
```js
function obj5(name, age) {
  this.name = name;
  this.age = age;
}
let instance = Reflect.construct(obj5, ['Lily', 9]);
console.log(instance);  //obj5 { name: 'Lily', age: 9 }
```

### apply
apply(func,thisArg,args):等同于Function.prototype.apply.call(func, thisArg, args)，用于绑
定this对象到thisArg上，执行func(args)<br>
一般来说，如果要绑定一个函数的this对象，可以这样写fn.apply(obj, args)，但是如果函数定义了自己的
apply方法，就只能写成Function.prototype.apply.call(fn, obj, args)，采用Reflect对象可以简化这种
操作。
```js
const ages = [11, 33, 12, 54, 18, 96];

//旧写法
const minNum = Math.min.apply(Math, ages);
const minString = Object.prototype.toString.call(minNum);
console.log(minNum, minString);//11 '[object Number]'

//新写法
const minNum2 = Reflect.apply(Math.min, Math, ages);
const minString2 = Reflect.apply(Object.prototype.toString, minNum2, []);
console.log(minNum2, minString2);//11 '[object Number]'
```

### ownKeys
ownKeys(obj):返回obj的所有属性,基本等同于Object.getOwnPropertyNames与 Object.getOwnPropertySymbols之和。
```js
let myObject = {
  foo: 1,
  bar: 2,
  [Symbol.for('baz')]: 3,
  [Symbol.for('bing')]: 4,
};

// 旧写法
Object.getOwnPropertyNames(myObject);// ['foo', 'bar']
Object.getOwnPropertySymbols(myObject);//[Symbol(baz), Symbol(bing)]

// 新写法
Reflect.ownKeys(myObject);// ['foo', 'bar', Symbol(baz), Symbol(bing)]
```

## 实现观察者模式
使用Proxy实现观察者模式:在给person改名字的时候打印他的名字和年龄
```js
let observeQueue = new Set();
let observe = function (fn) {  //把方法加入观察者队列中
  observeQueue.add(fn);
};
let observable = function (obj) {  //返回一个obj的代理，所有赋值操作都会调用观察者队列里的方法
  return new Proxy(obj, {
    set: function (target, property, value, receiver) {
      //先赋值,把obj里的name变成新值, 也可以写成：target[property] = value
      let re = Reflect.set(target, property, value, receiver);  
      
      observeQueue.forEach(fn => {  //执行所有的方法
        fn(obj);
      });
      return re;  //这里不return也可以
    }
  })
};

const person = observable({
  name: '张三',
  age: 20
});

function print(obj) {
  console.log(`${obj.name}, ${obj.age}`)
}

observe(print);
person.name = '李四';  //李四, 20
```

📚 扩展：<br>
Reflect.get(target,key,proxy)和target[key]的区别：<br>
* 在业务代码里，十分确定target是个什么，可以用target[key]的写法，性能一般会更好，因为没有call的开销；
* Reflect.get(target,key,proxy)常见于工具库或框架，做最后不拦截的穿透逻辑时,不知道target是什么，
  如果target本身是另一层proxy，或target上的key是一个getter而不是普通属性用target[key]可能会出bug
* Proxy里的get等还有一个“多余的传入参数”：receiver，它和Reflect.get的第三个参数是配套的，
  如果那个Proxy里的target还是一个proxy，并且对receiver有自己的用途，那么只能用
  Reflect.get(target,prop,receiver)，将receiver正确地传递进去。
* 还是关于receiver，一般来说receiver是表达式proxy[key]中的这个proxy，而如果你直接使用target[key]，
  那么等于把this给篡改了。而正确使用Reflect.get(target,prop,receiver)，还能确保this仍然是proxy.
  