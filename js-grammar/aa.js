function Father() {
  this.pro = true;
}
Father.prototype.getFatherPro = function () {
  return this.pro;
};
function Son() {
  this.pro = false;
}
Son.prototype.add = function () {
  return "继承之前子类原型添加的方法";
};
Son.prototype = new Father(); //继承：父类的实例赋值给子类的原型对象
// Son.prototype.__proto__ = Father.prototype; //a.
// Son.prototype = Father.prototype; //b.

Son.prototype.getSonPro = function () {
  return this.pro;
};
let sonIns = new Son();
console.log(sonIns.getFatherPro()); //false(调用父类的方法)
console.log('Father.prototype：',Father.prototype);
console.log('Son.prototype：', Son.prototype);
console.log('Son.constructor：',Son.constructor); //[Function: Function] （子类的构造函数是Function）
console.log('sonIns.constructor：',sonIns.constructor); //[Function: Father]（子类实例的构造函数指向父类）
console.log(sonIns instanceof Son) //true sonIns.__proto__ === Son.prototype
