```js
/*
给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。
尽可能想出更多的解决方案，至少有三种不同的方法可以解决这个问题。
要求使用空间复杂度为 O(1) 的 原地 算法。
示例 1:
输入: [1,2,3,4,5,6,7] 和 k = 3
输出: [5,6,7,1,2,3,4]
解释:
向右旋转 1 步: [7,1,2,3,4,5,6]
向右旋转 2 步: [6,7,1,2,3,4,5]
向右旋转 3 步: [5,6,7,1,2,3,4]
 */
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
  //环状替换：用start标记初始位置，当替换的元素等于start时，start+1，开始下一轮替换，同时用count计数，
  //当替换次数等于字符串长度是，说明元素已经全部替换
  const len = nums.length;
  if (!len) return;
  let count = 0;
  let start = 0;
  while (count < len) {
    let current = start;
    let pre = nums[start];
    do {
      current = (current + k) % len;
      const temp = nums[current];
      nums[current] = pre;
      pre = temp;
      count++;
    } while (start !== current && count < len);
    if (start === current) {
      start = start + 1;
    }
  }
};

var rotate2 = function(nums, k) {
  //翻转数组：先整体翻转，再翻转k的左边，再翻转k的右边（注意不能先分开翻转再整体翻转）
  k %= nums.length;
  reverseArray(nums, 0, k - 1);
  reverseArray(nums, k, nums.length - 1);
  reverseArray(nums, 0, nums.length - 1);
};

function reverseArray(arr, start, end) {
  for (let i = start; i <= (start + end) / 2; i++) {
    const temp = arr[i];
    arr[i] = arr[end + start - i];
    arr[end + start - i] = temp;
  }
}

const arr = [1, 2, 3, 4];
rotate2(arr, 2);
console.log(arr);

```
