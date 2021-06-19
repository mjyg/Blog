```js
/*
给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。
如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。
假设环境不允许存储 64 位整数（有符号或无符号）。
示例 1：
输入：x = 123
输出：321
示例 2：
输入：x = -123
输出：-321
 */
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
  let str = x < 0 ? -x : x;
  str = str.toString();
  str = parseInt(str.split('').reverse().join(''));
  x = x < 0 ? -str : str;
  if (x>Math.pow(2,31) - 1 || x < -Math.pow(2,31)) {
    return 0;
  }
  return x
};

var reverse2 = function(x) {
  let n = Math.abs(x);
  let re = 0;
  while(n > 0) {
    re = re * 10 + n % 10;
    n = parseInt(n /10);
  }
  re = x < 0 ? -re : re;
  return x < Math.pow(-2, 31) || x > Math.pow(2,31) - 1 ? 0 : re
};

console.log(reverse2(1534236469))

```
