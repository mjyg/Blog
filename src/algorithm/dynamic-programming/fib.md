```js
/*
斐波那契数，通常用 F(n) 表示，形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。也就是：
F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1
给你 n ，请计算 F(n) 。
 */
/*
输入：2
输出：1
解释：F(2) = F(1) + F(0) = 1 + 0 = 1
 */
/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
  //递归
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return fib(n - 1) + fib(n - 2);
};

var fib2 = function(n) {
  //动态规划
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }

  let dp0 = 0;
  let dp1 = 1;
  let dp2;
  for (let i = 2; i <= n; i++) {
    dp2 = dp0 + dp1;
    dp0 = dp1;
    dp1 = dp2;
  }
  return dp2;
};

console.log(fib2(20));

```
