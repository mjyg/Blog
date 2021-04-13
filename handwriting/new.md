```js
/*手写一个new操作符
 */
function Student(name, age) {
  this.name = name;
  this.age = age;
}

function myNew() {
  const obj = new Object(); //创建一个可供返回的对象
  const constructor = Array.prototype.shift(arguments); //提取构造函数
  obj.__proto__ = constructor.prototype; //使返回对象的__proto__和构造函数的prototype指向统一
  const re = constructor.apply(obj, arguments); //改变构造函数的指针，使返回对象可以调用构造函数的属性和方法
  return typeof re === 'object' ? re : obj; //如果构造函数显示返回一个对象，则使用该对象作为返回值
}

const s1 = new Student('Ann', 12);
const s2 = new Student('Bob', 13);
console.log(s1, s2);

```
