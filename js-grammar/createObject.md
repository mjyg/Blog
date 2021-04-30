# JS创建对象方法比较
使用构造函数或对象字面量都可以创建单个对象，但是创建多个相似对象就会产生大量重复代码，可以使用以下方式
来创建同一类对象：

## 工厂模式
```js
function createPerson(name, age) {
  let o = new Object()
  o.name=name;
  o.age = age;
  o.sayName = function(){
    console.log(name)
  }
  return o
}
let p1 = createPerson('Bob', 23);
let p2 = createPerson('John', 28);

console.log(typeof p1);  // object
console.log(p1 instanceof Object); // true
console.log(p1.sayName === p2.sayName);  //false
```
工厂模式解决了创建同类对象不用产生大量重复代码的问题，但是无法知道对象的具体类型，只能知道是Object类型

## 构造函数模式
### 构造函数模式1
```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayName = function () {
    console.log(this.name);
  };
}

p1 = new Person('Bob', 23); //将构造函数的作用域赋给新对象，构造函数里的this就指向调用该方法的新对象
p2 = new Person('John', 28);

console.log(p1);  // object
console.log(p1 instanceof Object); // true
console.log(p1 instanceof Person); // true （既是Object的实例也是Person的实例）

console.log(p1.sayName === p2.sayName);  //false
```
构造函数模式可以用来标志对象的具体类型，但其定义的方法要在每个实例上创建一遍，无法做到函数复用

### 构造函数模式2
```js
function Person2(name, age) {
  this.name = name;
  this.age = age;
  this.sayName = sayName;
}
function sayName() {
  console.log(this.name);
}

p1 = new Person2('Bob', 23);
p2 = new Person2('John', 28);
console.log(p1.name) //Bob
console.log(p1.sayName === p2.sayName);  //true
```
把方法移到构造函数外，实例就共享了全局作用域定义的同一个方法，但是如果需要多个方法，就需要定义多个全局
函数，毫无封装性可言

## 原型模式
### 原型模式1
```js
function Person3() {
}
Person3.prototype.name = 'Ann';
Person3.prototype.age = 25;
Person3.prototype.sayName = function () {
  console.log(this.name);
};
Person3.prototype.friends = ['a','b'];

p1 = new Person3();
p2 = new Person3();

console.log(p1.name);  //Ann
p1.name = 'Bob';
console.log(p1.name);  //Bob
console.log(p2.name);  //Ann (p1定义的属性覆盖了原型属性，成为p1自己的属性，无法影响到其他实例)
console.log(p1.sayName === p2.sayName);  //true
console.log(p1 instanceof Person3);  //true
console.log(p1.constructor);  //Person3

p1.friends.push('c');
console.log(p1.friends);  //[ 'a', 'b', 'c' ]
console.log(p2.friends);  //[ 'a', 'b', 'c' ]  (p2的friends属性值也修改了)
```
原型模式可以保证良好的封装性，在其上面定义的属性和方法都是实例共享的，且实例可以自定义属性覆盖原型里的
同名属性成为自己的属性<br>
但是对于包含引用类型的属性（friends）来说，无法做到这一点，修改引用类型的属性值，会影响所有实例的该属
性，因为所有实例共有的引用类型属性的地址是同一个地址<br>
而且每添加一个属性或方法都要写一遍Person.prototype,较为繁琐，封装性难以体现

### 原型模式2
原型模式的简单写法：使用对象字面量来重写整个原型对象，更好体现封装性
```js
function Person4() {
}
Person4.prototype = {
  name: 'Ann',
  age: 25,
  sayName: function () {
    console.log(this.name);
  }
};

p1 = new Person4();

console.log(p1 instanceof Person4);  //true
console.log(p1.constructor);  //Object (无法指向原构造函数Person)
```
**产生的问题**:重写了默认的prototype对象为Object的prototype）<br>
由于对象的constructor属性并非指向其构造函数,而是指向其构造函数的原型对象的constructor属性，因此p1的constructor
属性为Object.prototype.constructor,即为Object

### 原型模式3
在重写原型时显示添加constructor属性指向原来的构造函数
```js
Person4.prototype = {
  constructor: Person4,
  name: 'Ann',
  age: 25,
  sayName: function () {
    console.log(this.name);
  }
};
p1 = new Person4();
console.log(p1.constructor);  //Person4
```
**产生的问题**：如果先创建实例，再重新定义原型：
```js
Person4.prototype = {
  constructor: Person4,
  name: 'Ann',
  age: 25,
  sayName: function () {
    console.log(this.name);
  },
  friends: ['a']
};
console.log(p1.__proto__); 
// {constructor: [Function: Person4],name: 'Ann',age: 25, sayName: [Function: sayName] }  
// (没有新定义原型里的friends属性)
```
把原型修改为另一个对象只是把构造函数(Person4)的原型修改了，而实例的原型还是老的原型，即会切断实例与新
原型的联系，因此找不到新原型里的friends属性<br>

**总结原型模式创建对象**
* 优点：可以为实例提供共享的属性和方法，且有良好的封装性（写成简单模式时要注意会出现的两点问题，
  加constructor属性和实例创建在原型定义之后即可避免）
* 缺点：对每个实例无法一开始就定义自己的属性值，需要先定义好共享的属性值，再通过覆盖原型属性的方法修改成
  自己的属性值

## 组合使用构造函数模式和原型模式
```js
function Person5(name, age) {
  this.name = name;
  this.age = age;
  this.privateFriends = ['a','b'];
}
Person5.prototype = {
  constructor: Person5,
  publicFriends: ['c','d'],
  sayName: function () {
    console.log(this.name);
  }
};

p1 = new Person5('Ann', 22);
p2 = new Person5('John', 26);
p1.publicFriends.push('s');
p1.privateFriends.push('v');

console.log(p2.publicFriends);  //[ 'c', 'd', 's' ]
console.log(p2.privateFriends);  //[ 'a', 'b' ]
console.log(p1.sayName === p2.sayName);  //true
```
构造函数模式用来定义实例私有的属性，原型模式用来定义实例的方法和共享属性<br>
每个实例都会有自己的一份实例属性的副本，但同时又共享着对方法的引用,最大限度的节省了内存<br>
> 该方法是目前最认可的一种创建对象的方法

## 动态原型模式
```js
function Person6(name, age) {
  this.name = name;
  this.age = age;
  this.privateFriends = ['a','b'];
  if (typeof this.sayName === 'undefined') {
    console.log('create sayName');
    Person6.prototype.sayName = function () {
      console.log(this.name);
    }
  }
  if (typeof this.publicFriends === 'undefined') {
    console.log('create publicFriends');
    Person6.prototype.publicFriends = ['c', 'd'];
  }
}

p1 = new Person6('Ann', 22); //create sayName create publicFriends
p2 = new Person6('John', 26); //未打印“create sayName create publicFriends”
```
方法和共享属性的创建只会在第一次创建实例的时候调用，因为第一次调用完以后，原型对象就存在了该方法和共享
属性，后续实例会在原型对象中找到，便不会再次调用<br>
* 优点：避免了上一个方法独立的构造函数和原型的写法，把所有信息都封装在构造函数之中
* 缺点：如果方法和共享属性过多，则需要写多个if语句来判断

## 寄生构造函数模式
在已有的对象的基础上添加方法或属性创建满足需要的对象<br>
例如创建一个数组对象，该数组需要有以'+'连接元素为字符串的方法,但是又不想直接修改Array构造函数
```js
function SpecialArr() {
  let arr = new Array();
  arr.push.apply(arr, arguments);
  arr.splitArr = function () {
    return arr.join('+');
  };
  return arr;
}

let specialArr = new SpecialArr('a','b','c');
console.log(specialArr.splitArr()); //a+b+c
console.log(specialArr instanceof Array);  //true
```
specialArr的构造函数不是SpecialArray,SpecialArray只能看作其名义上的构造函数，其真正的构造函数是
SpecialArray里返回的对象的真正的构造函数Array

## 稳妥构造函数模式
所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象，最适合用在一些安全环境中或者防止数
据被其他应用程序改动<br>
新创建的实例方法不引用this，不使用new操作符构造函数<br>
稳妥构造函数模式也跟工厂模式一样，无法识别对象所属类型。
```js
function Person7(name, age) {
  let o = new Object();
  o.sayName = function () {
    console.log(name);
  };
  return o;
}
p1 = Person7('Ann', 23);
console.log(p1.sayName()); //Ann  (只能通过sayName方法访问name)
```
❀ 本文参考《JavaScript高级程序设计》
