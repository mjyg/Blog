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
console.log('old Son.prototype: ',Son.prototype)
// Son.prototype = new Father(); //a
// Son.prototype.__proto__ = Father.prototype; //b
Son.prototype = Father.prototype; //c

Son.prototype.getSonPro = function () {
  return this.pro;
};
let sonIns = new Son();
console.log('Father.prototype：',Father.prototype);
console.log('Son.prototype：', Son.prototype);
console.log('Son.constructor：',Son.constructor);
console.log('sonIns.constructor：',sonIns.constructor);
