# 手写instance操作符
instanceof 是用来判断 A 是否为 B 的实例<br>
表达式为：A instanceof B，如果 A 是 B 的实例，则返回 true,否则返回 false。
```js
function myInstance(A, B) {
  if (A.__proto__ === B.prototype) return true;
  while (B.__proto__) {
    if (A.__proto__ === B.__proto__) return true;
    B = B.__proto__
  }
  return false;
}

function Person() {}
console.log(new Person() instanceof Person); //true
console.log(Person instanceof Object); //true
console.log([] instanceof Array); //true
console.log([] instanceof Person); //false

console.log(myInstance(new Person(), Person)); //true
console.log(myInstance(Person, Object)); //true
console.log(myInstance([], Array)); //true
console.log(myInstance([], Person)); //false
```
