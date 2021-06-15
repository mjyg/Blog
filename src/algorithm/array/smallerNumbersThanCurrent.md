```js
/*
给你一个数组 nums，对于其中每个元素 nums[i]，请你统计数组中比它小的所有数字的数目。
换而言之，对于每个 nums[i] 你必须计算出有效的 j 的数量，其中 j 满足 j != i 且 nums[j] < nums[i] 。
以数组形式返回答案。
示例 1：
输入：nums = [8,1,2,2,3]
输出：[4,0,1,1,3]
解释：
对于 nums[0]=8 存在四个比它小的数字：（1，2，2 和 3）。
对于 nums[1]=1 不存在比它小的数字。
对于 nums[2]=2 存在一个比它小的数字：（1）。
对于 nums[3]=2 存在一个比它小的数字：（1）。
对于 nums[4]=3 存在三个比它小的数字：（1，2 和 2）。
提示：
2 <= nums.length <= 500
0 <= nums[i] <= 100
 */

//计数排序:先建立一个长度为100的数组保存每一个数出现的频次，再累加频次数组里的次数，然后对nums里每一
// 个元素，频次数组里的次数即为比它小的数字个数
//时间复杂度O(n),空间复杂度O(K)
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var smallerNumbersThanCurrent = function (nums) {
  let arr = new Array(101).fill(0); //初始化频次数组
  let re = [];

  //初始化频次数组
  // for (let i = 0; i <= 100; i++) {
  //   arr[i] = 0;
  // }

  //建立频次数组
  for (let i = 0; i < nums.length; i++) {
    arr[nums[i]]++;
  }

  //累加频次数组里的次数
  if(arr[0] === undefined) arr[0] = 0
  for (let i = 1; i <= 100; i++) {
    arr[i] += arr[i - 1];
  }

  //得到结果
  for (let i = 0; i < nums.length; i++) {
    re.push(arr[nums[i] - 1] ? arr[nums[i] - 1] : 0);  //这里是取前一个值,还要剔除nums[i]等于0的情况
  }

  return re;
};

console.log(smallerNumbersThanCurrent([5,0,10,0,10,6]));

```
