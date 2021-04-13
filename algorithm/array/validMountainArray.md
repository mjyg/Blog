```js
/*
给定一个整数数组 A，如果它是有效的山脉数组就返回 true，否则返回 false。
让我们回顾一下，如果 A 满足下述条件，那么它是一个山脉数组：
A.length >= 3
在 0 < i < A.length - 1 条件下，存在 i 使得：
A[0] < A[1] < ... A[i-1] < A[i]
A[i] > A[i+1] > ... > A[A.length - 1]
示例 1：
输入：[2,1]
输出：false
示例 2：
输入：[3,5,5]
输出：false
示例 3：
输入：[0,3,2,1]
输出：true
提示：
0 <= A.length <= 10000
0 <= A[i] <= 10000 
 */
/**
 * @param {number[]} A
 * @return {boolean}
 */
var validMountainArray = function(A) {
  let i = 0;
  let len = A.length;

  //递增扫描，找到山峰
  while (A[i + 1] > A[i] && i < len - 1) {
    i++;
  }

  //山峰不能是第一个或最后一个
  if (i === 0 || i === len - 1) return false;

  //递减扫描，如果后面的数递减，则为山脉数组
  while (A[i] > A[i + 1] && i < len - 1) {
    i++;
  }
  return i === len - 1;
};

console.log(validMountainArray([1, 7, 9, 5, 4, 1, 2]));

```
