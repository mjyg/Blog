```js
/*
一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。
示例 1:
输入: [0,1,3]
输出: 2
示例 2:
输入: [0,1,2,3,4,5,6,7,9]
输出: 8
限制：
1 <= 数组长度 <= 10000
 */

//1.直接循环，时间复杂度O(N),空间复杂度O(1)
var missingNumber = function(nums) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i) return i;
  }
  return nums.length;
};

//2.二分查找法：对于有序的数组, 都应该想到用二分法搜索
// 时间复杂度O(logN),空间复杂度O(1)
var missingNumber2 = function(nums) {
    var missingNumber = function(nums) {
    let start = 0;
    let end = nums.length - 1;
    let mid = null;

    while (start <= end) {
      mid = ((end + start) / 2) >>> 0;
      if (nums[mid] === mid) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    //最后必然出现三个指针都指向需要返回的index，此时进入最后一次循环，end=mid - 1,即end<start,退出循环,返回正确结果start或mid
    //考虑输入[0]或[0,1]这种正确的序列,正确结果是1/2，返回mid则会返回0/1，返回start才是正确结果1/2
    return start;
  };
};

```
