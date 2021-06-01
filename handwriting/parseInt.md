```js
function myParseInt(str, radix) {
  if (typeof str !== "string" && typeof str !== "number") return NaN;

  // 处理radix
  if (!radix) radix = 10;
  if (typeof radix !== "number" || radix < 2 || radix > 36) return NaN;

  // 处理字符串
  str = String(str)
    .trim()
    .split(".")[0];

  let re = 0;
  for (let i = 0; i <= str.length - 1; i++) {
    re += str[i] * Math.pow(radix, str.length - 1 - i);
  }
  return re;
}

console.log(parseInt(" 110  ", 2)); // 6
console.log(myParseInt(" 110.2  ", 2)); //6
```