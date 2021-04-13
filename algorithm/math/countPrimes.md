```js
/*
统计所有小于非负整数 n 的质数的数量。
示例 1：
输入：n = 10
输出：4
解释：小于 10 的质数一共有 4 个, 它们是 2, 3, 5, 7 。
示例 2：
输入：n = 0
输出：0
示例 3：
输入：n = 1
输出：0
提示：
0 <= n <= 5 * 106
 */
/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function(n) {
  /*如果用 2 到 √n 之间(包含边界)的所有整数去除，均无法整除，则 n 为质数。
     并且，我们可以发现，一切非 2 偶数一定不可能为质数
     时间复杂度为O(nlogn)
    */
  if (n <= 2) return 0;
  let re = 0;
  for (let i = 3; i < n; i += 2) {
    let flag = true;
    for (let j = 2; j <= Math.sqrt(i); j++) {
      const r = i / j;
      if (r >> 0 === r) {
        flag = false;
        break;
      }
    }
    if (flag) re++;
  }
  return re + 1;
};

console.log(countPrimes(10));

```
