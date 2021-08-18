/*
乘积最大子数组

给你一个整数数组 nums ，请你找出数组中乘积最大的连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

示例 1:
输入: [2,3,-2,4]
输出: 6
解释: 子数组 [2,3] 有最大乘积 6。
示例 2:
输入: [-2,0,-1]
输出: 0
解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。
 */

// 动态规划：当前的最大乘积= max(前一段最大乘积乘以当前值, 当前值)
// 但是这里当当前值是负数时，当前的最大乘积= max(前一段最小乘积乘以当前值, 当前值)
// 所以：当前的最大乘积 = max(前一段最大乘积乘以当前值，前一段最小乘积乘以当前值, 当前值)
var maxProduct = function(nums) {
  let max = -Infinity;
  let curMax = 1;
  let curMin = 1;

  for(let i = 0; i < nums.length; i ++) {
    let cMax = curMax,cMin = curMin

    // 当前的最大乘积 = max(前一段最大乘积乘以当前值，前一段最小乘积乘以当前值, 当前值)
    curMax = Math.max(cMax * nums[i], cMin * nums[i], nums[i])

    // 维护一个当前最小乘积
    curMin = Math.min(cMax * nums[i], cMin * nums[i], nums[i])

    // 最大乘积= max(前一个最大乘积，当前最大乘积)
    max = Math.max(max, curMax)
  }
  return max
};

console.log(maxProduct([2,3,-2,4,-2])) //96


