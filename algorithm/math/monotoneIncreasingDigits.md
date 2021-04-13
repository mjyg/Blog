```js
/*
给定一个非负整数 N，找出小于或等于 N 的最大的整数，同时这个整数需要满足其各个位数上的数字是单调递增。
（当且仅当每个相邻位数上的数字 x 和 y 满足 x <= y 时，我们称这个整数是单调递增的。）
示例 1:
输入: N = 10
输出: 9
示例 2:
输入: N = 1234
输出: 1234
示例 3:
输入: N = 332
输出: 299
说明: N 是在 [0, 10^9] 范围内的一个整数。
 */

/**
 * @param {number} N
 * @return {number}
 */
var monotoneIncreasingDigits = function(N) {
  //常规算法，从N往前遍历判断，时间复杂度为O(n*n)
  for (let i = N; i >= 0; i--) {
    let num1 = i % 10;
    let num2;
    let num = (i / 10) >> 0;
    if (num === 0) return i;
    while (num > 0) {
      num2 = num % 10;
      if (num1 < num2) break;
      num1 = num2;
      num = (num / 10) >> 0;
    }
    if (num === 0) return i;
  }
};

var monotoneIncreasingDigits2 = function(N) {
  //贪心算法：把N转为数组，从后往前遍历，如果前一位大于后一位，则把前一位减1，后面的都置为9
  //时间复杂度为O(logN),log(N)表示N的位数
  if (N < 10) return N;

  const n = N.toString().split('');
  for (let i = n.length - 1; i > 0; i--) {
    if (n[i] < n[i - 1]) {
      for (let j = i; j < n.length; j++) n[j] = 9;
      n[i - 1] -= 1;
    }
  }
  return Number(n.join(''));
};

console.log(monotoneIncreasingDigits2(100));

```
