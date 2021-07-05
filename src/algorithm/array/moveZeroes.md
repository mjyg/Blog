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

// 解法二： 从后往前遍历，碰到0 ，记住已经调整好0的位置，碰到0，就把从该位置往前的数字前移一位，再把0放回来
var moveZeroes2 = function(nums) {
  const len = nums.length
  let zeroLeft = len
  for(let i = len - 1; i>=0; i --) {
    if(nums[i] === 0) {
      for(let j = i; j < zeroLeft - 1;j++) {
        nums[j] = nums[j+1]
      }
      zeroLeft--;
      nums[zeroLeft] = 0
    }
  }
}

// 解法三：从前往后遍历，用n记住前面0的个数，遇到0则n+1,否则交换该数字和i-n下标的数字
// 时间复杂度为O(n)
var moveZeroes3 = function (nums) {
  if (nums.length === 1) return;
  let n = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      n++;
      continue;
    }
    if (n === 0) continue;  //n=0时不交换，表示前面没有非0数字
    nums[i-n] = nums[i];  //i-n是已调整好的非0数字的下一个数字
    nums[i] = 0;
  }
};

const nums = [0,1,0,3,12];
moveZeroes(nums);
console.log(nums);

```
