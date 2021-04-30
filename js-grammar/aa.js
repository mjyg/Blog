function Father(name) {
  console.log('调用父类构造函数')
  this.name = name;
  this.privateFriends = ['a', 'b'];
  this.age = 60
}
function Son(name) {
  Father.call(this, name);
  this.privateFriends = ['c', 'd'];//将会覆盖父类的同名属性
}

Father.prototype.sayName = function() {
  return this.name;
}

Father.prototype.publicFriends=  ['f', 'g'];

Father.prototype.sayFriend= function () {
  console.log('这是父类的方法');
  return this.privateFriends + this.publicFriends;
}

let prototype = Object.create(Father.prototype);  //只把父类的原型对象当做prototype的原型对象
prototype.constructor = Son; //实现原型和构造函数的互相指引
Son.prototype = prototype;

console.log('prototype:',prototype); //Father {}

Son.prototype.sayFriend = function () { //添加子类的方法,将会覆盖父类的方法
  console.log('这是子类的方法');
  return this.privateFriends + this.publicFriends;
};

let son= new Son('Bob');  // 这一句son.__proto__ = Son.prototype

console.log('Son.prototype:',Son.prototype);
console.log('Son.constructor：',Son.constructor);
console.log('son.constructor：',son.constructor);
console.log('son.__proto__:',son.__proto__);  //没有了父类构造函数里的属性和方法
console.log('son instanceof Son:',son instanceof Son) //true sonIns.__proto__ === Son.prototype


console.log('son:',son);
console.log('prototype:',prototype);
console.log('son.publicFriends',son.publicFriends);  //[ 'f', 'g' ] (依然可以根据原型链调到父类原型对象上的方法和属性)


