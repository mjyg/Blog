```js
/*
给你一个按升序排序的整数数组 num（可能包含重复数字），请
你将它们分割成一个或多个子序列，其中每个子序列都由连续整数组成且长度至少为 3 。
如果可以完成上述分割，则返回 true ；否则，返回 false 。
*/
/*
示例 1：
输入: [1,2,3,3,4,5]
输出: True
解释:
你可以分割出这样两个连续子序列 :
1, 2, 3
3, 4, 5
示例 2：
输入: [1,2,3,3,4,4,5,5]
输出: True
解释:
你可以分割出这样两个连续子序列 :
1, 2, 3, 4, 5
3, 4, 5
示例 3：
输入: [1,2,3,4,4,5]
输出: False
提示：
输入的数组长度范围为 [1, 10000]
 */
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isPossible = function(nums) {
  if (nums.length < 3) return false;
  let start = [nums[0]]; //每个序列的开始点
  let end = [nums[0]]; //每个序列的结束点
  for (let i = 1; i < nums.length; i++) {
    const endIndex = end.lastIndexOf(nums[i] - 1); //从已有序列的后面从后开始查找（贪心策略：使最新加入的序列尽肯能长，因为新序列肯定比旧序列短）
    if (endIndex > -1) {
      //找到，可以接在已有序列的后面
      end[endIndex] = nums[i];
    } else {
      //找不到，重新开一个序列
      start[i] = nums[i];
      end[i] = nums[i];
    }
  }

  //是否所有序列长度都大于2
  for (let j = 0; j < start.length; j++) {
    if (end[j] - start[j] < 2) {
      return false;
    }
  }
  return true;
};

console.log(isPossible([1, 2, 3, 3, 4, 4, 5, 5, 7]));

```
