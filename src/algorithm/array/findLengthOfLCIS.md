```js
/*
给定一个未经排序的整数数组，找到最长且连续的的递增序列，并返回该序列的长度。
示例 1:
输入: [1,3,5,4,7]
输出: 3
解释: 最长连续递增序列是 [1,3,5], 长度为3。
尽管 [1,3,5,7] 也是升序的子序列, 但它不是连续的，因为5和7在原数组里被4隔开。
示例 2:

输入: [2,2,2,2,2]
输出: 1
解释: 最长连续递增序列是 [2], 长度为1。
注意：数组长度不会超过10000。
 */

//直接遍历一遍，时间复杂度O(N),空间复杂度O(1)
var findLengthOfLCIS = function(nums) {
  const len = nums.length;
  if (len === 1 || len === 0) return len;
  let count = 1; //记住每个连续序列长度
  let maxLen = 1; //记住最长序列长度
  for (let i = 1; i < len; i++) {
    if (nums[i] > nums[i - 1]) {
      count++;
    } else {
      maxLen = count > maxLen ? count : maxLen;
      count = 1;
    }
  }
  return maxLen > count ? maxLen : count;
};

```
