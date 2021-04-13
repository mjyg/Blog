```js
/*
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
示例:
输入: [0,1,0,3,12]
输出: [1,3,12,0,0]
说明:
必须在原数组上操作，不能拷贝额外的数组。
尽量减少操作次数。
 */
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */

var moveZeroes = function (nums) {
  //双指针，一个指针指向非0，一个指针往下遍历
  if (!nums.length || nums.length === 1) return;
  let i = 0;
  let zeroP = 0;
  while (i < nums.length && zeroP < nums.length) {
    while (nums[zeroP] === 0 && zeroP < nums.length) zeroP++;
    if (zeroP < nums.length) {
      const temp = nums[zeroP];
      nums[zeroP] = nums[i];
      nums[i] = temp;
      i++;
      zeroP ++;
    }
  }
};

const nums = [0,1,0,3,12];
moveZeroes(nums);
console.log(nums);

```
