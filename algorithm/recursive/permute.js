/*
给定一个没有重复数字的序列，返回其所有可能的全排列。
示例:
输入: [1,2,3]
输出:
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permutate = function(nums) {
  const re = [];
  perm(nums, 0, nums.length-1)

  // 递归算法:任取一个数打头，对后面n-1个数进行全排序，要求n-1个数的全排序，则要求n-2个数的全排序……
  // 直到要求的全排序只有一个数，找到出口。
  function perm (nums, k, m) {
    if (k === m) {
      re.push([...nums]) //全排列只有一个数，输出
    } else {
      for (let i = k; i <= m; i++) { //遍历m~n个数，每次以a[i]打头
        swap(nums, k, i); //把打头的数放在最开始的位置
        perm(nums, k + 1, m);
        swap(nums, k, i); // 避免重复排序，每个数打头结束后都恢复初始排序
      }
    }
  }
  return re;
}

function swap(nums, m, n) {
  const temp = nums[m];
  nums[m] = nums[n];
  nums[n] = temp;
}

console.log(permutate([1, 2, 3]));
