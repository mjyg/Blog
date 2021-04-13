```js
/*
在无限的整数序列 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ...中找到第 n 个数字。
注意:
n 是正数且在32位整数范围内 

输入:
11
输出:
0
说明:
第11个数字在序列 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ... 里是0，它是10的一部分。
 */
var n = function (n) {
  //先求出该数所在区间的位数
  let bit = 1; //所在区间的位数
  let p = 9; //区间的长度
  while (n - p * bit > 0) {
    n = n - p * bit;
    bit++;
    p = p * 10;
  }

  const indexInSubRange = (n - 1) / bit; //定位到是区间里的第几个数
  const indexInNum = (n - 1) % bit; //定位到是该数的第几位

  const num = Math.pow(10, bit - 1) + indexInSubRange; //还原数字
  const re = ((num >> 0) + '')[indexInNum]; //结果是该数字的第indexInNum位

  return re;
};

console.log(n(8));

```
