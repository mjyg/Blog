// js判断一个对象是数组的不同方式

const arr = [1];

//1.instanceof
console.log(arr instanceof Array);

//2.Array.isArray
console.log(Array.isArray(arr));

// 3,4,5是原型相关的方法
//3.__proto_
console.log(arr.__proto__ === Array.prototype);

//4.getPrototypeOf
console.log(Object.getPrototypeOf(arr) === Array.prototype);

//5.isPrototypeOf() 方法用于测试一个对象是否存在于另一个对象的原型链上。
console.log(Array.prototype.isPrototypeOf(arr));

//6.constructor
console.log(arr.constructor === Array);
// 但是像这样arr.contrtuctor = Object该方法就不适用

//7.Object.prototype.toString方法
console.log(Object.prototype.toString.apply(arr) === '[object Array]');
//但是如果改变了Object.prototype.toString方法，该方法就不适用
