function createPerson(name, age) {
  this.name=name;
  this.age = age;
  this.sayName = sayName
}

function sayName () {
  console.log(this.name)
}
let p1 = new createPerson('Bob', 23);
let p2 = new createPerson('John', 28);

console.log(p1.name) //Bob
console.log(typeof p1);  // object
console.log(p1 instanceof Object); // true
console.log(p1.sayName === p2.sayName);  //false
