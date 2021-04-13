```js
/*
数组的每个索引作为一个阶梯，第 i个阶梯对应着一个非负数的体力花费值 cost[i](索引从0开始)。
每当你爬上一个阶梯你都要花费对应的体力花费值，然后你可以选择继续爬一个阶梯或者爬两个阶梯。
您需要找到达到楼层顶部的最低花费。在开始时，你可以选择从索引为 0 或 1 的元素作为初始阶梯。
 */
/*
输入: cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
输出: 6
解释: 最低花费方式是从cost[0]开始，逐个经过那些1，跳过cost[3]，一共花费6
 */
/**
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = function(cost) {
  //动态规划：每一步从倒数第一步过来或者从倒数第二步过来
  const dp = [];
  const n = cost.length;
  dp[0] = cost[0];
  dp[1] = cost[1];
  for (let i = 2; i < n; i++) {
    dp[i] = Math.min(dp[i - 1], dp[i - 2]) + cost[i]; //每一步的最小花费
  }
  return Math.min(dp[n - 1], dp[n - 2]);
};

var minCostClimbingStairs2 = function(cost) {
  //动态规划：使用滚动数组优化空间复杂度
  const dp = [];
  const n = cost.length;
  dp[0] = cost[0];
  dp[1] = cost[1];
  for (let i = 2; i < n; i++) {
    dp[2] = Math.min(dp[1], dp[0]) + cost[i]; //每一步的最小花费
    dp[0] = dp[1];
    dp[1] = dp[2];
  }
  return Math.min(dp[1], dp[0]);
};

console.log(minCostClimbingStairs2([0, 0, 0, 1]));

```
