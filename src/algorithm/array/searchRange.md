```js
/*
给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。
如果数组中不存在目标值 target，返回 [-1, -1]。
进阶：
你可以设计并实现时间复杂度为 O(log n) 的算法解决此问题吗？
*/
/*
示例 1：
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
示例 2：
输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]
示例 3：
输入：nums = [], target = 0
输出：[-1,-1]
提示：
0 <= nums.length <= 105
-109 <= nums[i] <= 109
nums 是一个非递减数组
-109 <= target <= 109
 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
  const leftBorder = leftBinarySearch(nums, target, true);
  const rightBorder = rightBinarySearch(nums, target, false);

  //target排在nums左边或者右边的情况
  if (leftBorder === -2 || rightBorder === -2) return [-1, -1];

  //target排在nums中间但是nums中没有target
  if (leftBorder + 1 >= rightBorder) return [-1, -1];

  return [leftBorder + 1, rightBorder - 1];
};

//寻找左边界
function leftBinarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let leftBorder = -2;
  while (left <= right) {
    let mid = ((left + right) / 2) >> 0;
    if (nums[mid] >= target) {
      right = mid - 1;
      leftBorder = right;
    } else {
      left = mid + 1;
    }
  }
  return leftBorder;
}

//寻找右边界
function rightBinarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let rightBorder = -2;
  while (left <= right) {
    let mid = ((left + right) / 2) >> 0;
    if (nums[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
      rightBorder = left;
    }
  }
  return rightBorder;
}

//方法二：寻找target的过程为寻找Nums里第一个大于等于target的数（左边界），第一个大于target的数（右边界）
function binarySearch(nums, target, findLeft) {
  let left = 0;
  let right = nums.length - 1;
  let re = nums.length;
  while (left <= right) {
    let mid = ((left + right) / 2) >> 0;
    if (nums[mid] > target || (findLeft && nums[mid] >= target)) {
      right = mid - 1;
      re = mid;
    } else {
      left = mid + 1;
    }
  }
  return re;
}

var searchRange2 = function(nums, target) {
  const leftIdx = binarySearch(nums, target, true);
  const rightIdx = binarySearch(nums, target) - 1;
  if (
    leftIdx <= rightIdx &&
    rightIdx < nums.length &&
    nums[leftIdx] === target &&
    nums[rightIdx] === target
  ) {
    return [leftIdx, rightIdx];
  }
  return [-1, -1];
};

console.log(searchRange2([5, 7, 7, 8, 10], 9));

```
