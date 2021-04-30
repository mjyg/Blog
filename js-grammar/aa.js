class Car {
  static color = 1;
  constructor(price){
    this.price = price
  }
  test(){
    console.log(this.price)
  }
}

class Cruze extends Car {
  constructor(price){
    super(price)
  }
}

const cruze = new Cruze(3000)

console.log('Car.prototype', Car.prototype)
console.log('Cruze.prototype:',Cruze.prototype);
console.log('Cruze.constructor：',Cruze.constructor);
console.log('cruze.constructor：',cruze.constructor);
console.log('cruze.__proto__:',cruze.__proto__);
console.log('cruze instanceof Son:',cruze instanceof Cruze)
console.log('cruze:',cruze)


console.log(Cruze.color)  //1 继承静态属性
cruze.test();  //3000
