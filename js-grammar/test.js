//继承：JS主要依靠原型链来实现继承

//1.原型链继承
function Father() {
  this.pro = true;
}
Father.prototype.getFatherPro = function () {
  return this.pro;
};
function Son() {
  this.pro = false;
}
Son.prototype.add = function(){
  return '继承之前子类原型添加的方法' ;
};
Son.prototype = new Father(); //继承：父类的实例赋值给子类的原型对象
// Son.prototype.__proto__ = Father.prototype; //a.
// Son.prototype = Father.prototype; //b.

Son.prototype.getSonPro = function () {
  return this.pro;
};
let sonIns = new Son();
console.log(sonIns.getFatherPro());  //false(调用父类的方法)
console.log(Father.prototype);  //Father { getFatherPro: [Function] }
console.log(Son.prototype);  //Father { pro: true, getSonPro: [Function] }
// 子类的原型对象是父类，显示了父类的pro属性，却没显示父类的getFatherPro方法
//因为pro属性定义在父类上，父类的getFatherPro方法定义在父类的原型对象上
//找不到在重定义原型对象之前的add方法
console.log(Son.constructor); //[Function: Function] （子类的构造函数是Function）
console.log(sonIns.constructor); //[Function: Father]（子类实例的构造函数指向父类）
console.log(sonIns instanceof Son); //true
//重新定义了子类的原型对象，子类实例的构造函数指向父类的constructor属性

//把继承语句替换成a：
function Son2() {
  this.pro = false;
}
Son2.prototype.__proto__ = Father.prototype;
Son2.prototype.getSonPro = function () {
  return this.pro;
};
let sonIns2 = new Son2();

console.log(Father.prototype);  //Father { getFatherPro: [Function] }
console.log(Son2.prototype);  //Son2 { getSonPro: [Function] }（子类的原型对象还是子类）
console.log(Son2.constructor);//[Function: Function]
console.log(sonIns2.constructor);//[Function: Son2]（子类实例的构造函数还是子类）
console.log(sonIns2.getFatherPro());  //false (但是子类能调用父类的方法)
console.log(sonIns2 instanceof Son2); //true
//可以看作是不严格的继承，没有重新定义子类的原型对象，所以子类的构造函数不变


///把继承语句替换成b：
function Son3() {
  this.pro = false;
}
Son3.prototype = Father.prototype;
Son3.prototype.getSonPro = function () {
  return this.pro;
};
let sonIns3 = new Son3();

console.log(Father.prototype);  //Father { getFatherPro: [Function], getSonPro: [Function] }
console.log(Son3.prototype);  //Father { getFatherPro: [Function], getSonPro: [Function] }
console.log(Son3.constructor);//[Function: Function]
console.log(sonIns3.constructor);//[Function: Father]
console.log(sonIns3 instanceof Son3); //true
//可以看作是直接用父类的原型对象替换子类的原型对象，子类和父类的原型对象指向同一地址，即子类的原型对象就
// 是父类的 原型对象,子类实例的构造函数指向父类
//重新定义了子类的原型对象，子类实例的构造函数指向父类的constructor属性

//总结：原型链继承在创建子类的实例时，无法向父类构造函数传递参数

//2.借用构造函数
function Father4(name) {
  this.colors = ['red', 'blue'];
  this.name = name;
  this.sayName = function () {
    return this.name;
  };
  this.age = 50;
}
function Son4(name) {
  // this.age = 29;  //若该语句写在这里（调用父类构造函数之前，则会被父类的同名属性覆盖，子类实例的
  //age变成50）
  Father4.call(this, name);//调用父类的构造函数，继承父类的属性和方法
  this.age = 29;
}
let son = new Son4('Bob');
let son2 = new Son4('Lily');
son.colors.push('yellow');
console.log(son.__proto__);//Son4 {}  //子类的原型对象和子类构造函数内内调用父类的构造函数无关系
console.log(Son4.prototype);//Son4 {} //子类的原型对象未变
console.log(son); //Son4 { colors: [ 'red', 'blue', 'yellow' ], name: 'Bob' }
console.log(son2);  //Son4 { colors: [ 'red', 'blue' ], name: 'Lily' }
console.log(son.sayName === son2.sayName);  //false
console.log(son.age);  //29

//总结借用构造函数方法：
//优点：在创建子类的实例时，能向父类构造函数传递参数，创建自己的属性值
//缺点：1.使子类能继承父类的属性和方法，但是子类的原型对象未改变，没有构造出继承的原型链，不能算是继承
//     2.在构造函数中定义的方法不能复用，每个子类实例都要重新创建方法

//3.组合继承：使用原型链实现对共享属性和方法的继承，通过借用构造函数实现对私有属性的继承
function Father5(name) {
  this.name = name;
  this.privateFriends = ['a', 'b'];
}
function Son5(name) {
  Father5.call(this, name);
  this.privateFriends = ['c', 'd'];//将会覆盖父类的同名属性
}
Father5.prototype = {
  constructor: Father5,
  sayName: function(){
    return this.name;
  },
  publicFriends: ['f', 'g'],
  sayFriend: function () {
    console.log('这是父类的方法');
    return this.privateFriends + this.publicFriends;
  }
};

Son5.prototype = new Father5(); //继承
// Son5.prototype.constructor = Son5;//实现原型和构造函数的互相指引(不太懂这一句的意义)
Son5.prototype.sayFriend = function () { //添加子类的方法,将会覆盖父类的方法
  console.log('这是子类的方法');
  return this.privateFriends + this.publicFriends;
};

let son51 = new Son5('Bob');
let son52 = new Son5('Lily');

console.log(Son5.prototype); //Father5 {name: undefined,privateFriends: [ 'a', 'b' ],
// sayFriend: [Function] } (原型链上继承了父类)

son51.privateFriends.push('z');
son51.publicFriends.push('x');
console.log(son52.privateFriends);  //[ 'c', 'd' ] (未影响到实例二的私有属性)
console.log(son52.publicFriends);  //[ 'f', 'g', 'x' ] （影响到实例二的共享属性）

console.log(son51.sayFriend === son52.sayFriend); //true  (做到了函数复用)
console.log(son51.sayFriend());// 这是子类的方法 c,d,zf,g,x (覆盖了父类的同名方法)

console.log(son51);//Father5 { name: 'Bob', privateFriends: [ 'c', 'd', 'z' ] }
console.log(son51.__proto__);//Father5 {name: undefined,privateFriends: [ 'a', 'b' ],
// sayFriend: [Function] }


//总结组合继承：
//优点：弥补了借用构造函数的两个缺点，能传递参数，复用了父类的方法，且有继承的原型链，是最常用的
//      继承模式
//缺点：会调用两次父类构造函数，一次是在子类继承父类创建子类原型的时候调用了父类构造函数，另一次是在实例
//      化子类的时候，在子类构造函数内部调用了父类构造函数，于是实例化的子类对象在其本身和原型对象里都有
//      一份父类构造函数里有的属性和方法

//4.原型式继承：采用Object.create(protoObj,extendObj)
//参数说明：protoObj:用作新对象原型的对象；extendObj:为新对象定义额外属性的对象通过描述符定义（可选）
let father5 = {
  publicFriends: ['f', 'g'],
  name: 'f',
  sayFriend: function () {
    console.log('这是父类的方法');
    return this.privateFriends + this.publicFriends;
  }
};
let friend = 'a';
let son6 = Object.create(father5,{
  privateFriends: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: ['g','h'],
  },
  sayFriend: {
    configurable: true,
    enumerable: true,
    get: () => {
      return friend;
    },
    set: (newValue) => {
      console.log(this.privateFriends);
      friend = newValue;
    },
  },
  // add: () => {  //未报错，但是无效，只能加数据属性和访问器属性
  //     console.log('新定义的方法');
  // }
});
console.log(son6);//{ privateFriends: [ 'g', 'h' ], sayFriend: [Getter/Setter] }
console.log(son6.prototype);//undefined (不是方法，没有该属性)
console.log(son6.__proto__);//{ publicFriends: [ 'f', 'g' ],name: 'f',
// sayFriend: [Function: sayFriend]

son6.sayFriend = 'z';
console.log(son6.sayFriend);  //undefined z (不知道为啥this.privateFriends是undefined)
console.log(son6.publicFriends); //[ 'f', 'g' ]

let son7 = Object.create(father5);
son6.publicFriends.push('l');
console.log(son7.publicFriends);  //[ 'f', 'g', 'l' ] (不同对象共享的属性和方法引用地址相同)

//总结原型式继承：
//优点：如果子类对象与父类对象非常相似，没必要重新构建子类构造函数，可以采用此种模式，把子类新增的属性放
//      create方法的第二个属性中
//缺点：1.新增的属性只能通过描述符定义，无法直接新增方法
//     2.引用类型属性为不同对象的共享属性

//5.寄生组合式继承:弥补组合继承调用两次父类构造函数的问题
function Father8(name) {
  this.name = name;
  this.privateFriends = ['a', 'b'];
}
function Son8(name) {
  Father8.call(this, name);
  this.privateFriends = ['c', 'd'];//将会覆盖父类的同名属性
}
Father8.prototype = {
  constructor: Father8,
  sayName: function(){
    return this.name;
  },
  publicFriends: ['f', 'g'],
  sayFriend: function () {
    console.log('这是父类的方法');
    return this.privateFriends + this.publicFriends;
  }
};

let prototype = Object.create(Father8.prototype);  //只把父类的原型对象当做prototype的原型对象
// prototype.constructor = Son8; //实现原型和构造函数的互相指引
Son8.prototype = prototype;

console.log(prototype); //Father8 {}

Son8.prototype.sayFriend = function () { //添加子类的方法,将会覆盖父类的方法
  console.log('这是子类的方法');
  return this.privateFriends + this.publicFriends;
};

let son8= new Son8('Bob');
console.log(son8);//Father8 { name: 'Bob', privateFriends: [ 'c', 'd' ] }
console.log(son8.__proto__);//Father8 { sayFriend: [Function] }//没有了父类构造函数里的属性和方法
console.log(prototype); //Father8 { sayFriend: [Function] }
console.log(son8.publicFriends);  //[ 'f', 'g' ] (依然可以根据原型链调到父类原型对象上的方法和属性)

//可以看出子类的原型对象上没有了父类构造函数里的属性和方法，继承的原型链存在，该继承模式是最理想的继承方式
