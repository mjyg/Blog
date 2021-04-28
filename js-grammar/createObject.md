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
