/*
最长递增子序列

给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7]
是数组 [0,3,1,6,2,2,7] 的子序列。

示例 1：
输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
示例 2：
输入：nums = [0,1,0,3,2,3]
输出：4
示例 3：
输入：nums = [7,7,7,7,7,7,7]
输出：1
 */

var lengthOfLIS = function (nums) {
  const len = nums.length;
  const dp = new Array(len).fill(1);
  let re = 1
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < i; j++) {
      // 当当前值大于前面的值时，表示可以把当前值接在前面值的后面形成新的递增子序列
      // 更新dp[i]为 Math.max(dp[i], dp[j] + 1),这里max表示再之前的值和加上新序列的值中取最大
      nums[i] > nums[j] && (dp[i] = Math.max(dp[i], dp[j] + 1));
    }
    re = Math.max(re, dp[i])
  }
  console.log(dp) // [ 1, 2, 1, 3, 3, 4 ]
  return re
};

console.log(lengthOfLIS( [0,1,0,3,2,3]))