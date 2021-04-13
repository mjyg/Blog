```js
function isMirror(num) {
  let x = num % 10; //除10取余
  let y = (num - x) / 10; //除10取整

  while (y) {
    x = x * 10 + (y % 10);
    y = (y - (y % 10)) / 10;
  }
  return x === num;
}

console.log(isMirror(121));
console.log(isMirror(123));

```
