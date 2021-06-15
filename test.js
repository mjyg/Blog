let testLet = 1;
var apple = 2

console.dir((() => {
  let test2Let = 3;
  var apple2 = 4;
  return function() {
    return test2Let, apple2
  }
})())


