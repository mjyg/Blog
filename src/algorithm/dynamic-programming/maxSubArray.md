```js
/*输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。
要求时间复杂度为O(n)。
示例1:
输入: nums = [-2,1,-3,4,-1,2,1,-5,4]
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  let maxSum = nums[0];
  let sum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (sum <= 0) {
      sum = nums[i];
    } else {
      sum += nums[i];
    }
    if (sum > maxSum) maxSum = sum;
  }
  return maxSum;
};

//动态规划解法
/**
 * 思路分析
 1、状态方程 ： max( dp[ i ] ) = getMax( max( dp[ i -1 ] ) + arr[ i ] ,arr[ i ] )
 2、上面式子的意义是：我们从头开始遍历数组，遍历到数组元素 arr[ i ] 时，连续的最大的和 可能为
    max( dp[ i -1 ] ) + arr[ i ] ，也可能为 arr[ i ] ，做比较即可得出哪个更大，取最大值。时间
    复杂度为 n。
 */
var maxSubArray2 = function (nums) {
  let sum = nums[0];
  let maxSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    sum = Math.max(sum + nums[i], nums[i]);
    maxSum = Math.max(sum, maxSum)
  }
  return maxSum;
};

console.log(maxSubArray2([-2, 1, -3, 4, -1, 2, 1, -5, 4]));

```
