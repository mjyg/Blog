```js
//实现一个函数模拟除法，用括号把无限循环小数扩起来，例如 1/3 = 1.333333，该函数需要返回'1.(3)'。
function division(num1, num2) {
  let a = Math.floor(num1 / num2); //整数
  let b = num1 % num2; //余数

  if (b === 0) return a;

  //循环余数，用一个对象保存被除数和商的位置，如果被除数重复出现，则为循环小数
  let obj = {};
  let re = [];
  let i = 0;
  while (b !== 0) {
    if (obj[b] !== undefined) {
      re.splice(obj[b], 0, "(");
      return a + "." + re.join("") + ")";
    }
    obj[b] = i;
    b = b * 10;
    re.push(Math.floor(b / num2));
    b = b % num2; //新的余数
    i++;
  }
  return a + "." + re.join("");
}

// console.log(division(192901232966821, 1562500000000000)); //0.(1234567890987654321)
// console.log(division(1,2))
console.log(division(1,7))

```
