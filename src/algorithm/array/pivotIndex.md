```js
/**
 给定一个整数类型的数组 nums，请编写一个能够返回数组 “中心索引” 的方法。
 我们是这样定义数组 中心索引 的：数组中心索引的左侧所有元素相加的和等于右侧所有元素相加的和。
 如果数组不存在中心索引，那么我们应该返回 -1。如果数组有多个中心索引，那么我们应该返回最靠近左边的那一个。
 **/
/*
输入：
nums = [1, 7, 3, 6, 5, 6]
输出：3
解释：
索引 3 (nums[3] = 6) 的左侧数之和 (1 + 7 + 3 = 11)，与右侧数之和 (5 + 6 = 11) 相等。
同时, 3 也是第一个符合要求的中心索引。
*/
/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function (nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let i = 0;
  let leftTotal = 0;
  while (i < nums.length) {
    if (leftTotal === (total - nums[i]) / 2) return i;
    leftTotal += nums[i++];
  }
  return -1;
};

console.log(pivotIndex([-1, -1, -1, 0, 1, 1]));

```
