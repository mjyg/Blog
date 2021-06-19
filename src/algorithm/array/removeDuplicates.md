```js
/*
给定一个排序数组，你需要在 原地 删除重复出现的元素，使得每个元素只出现一次，返回移除后数组的新长度。
不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。
示例:
给定 nums = [0,0,1,1,1,2,2,3,3,4],
函数应该返回新的长度 5, 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4。
你不需要考虑数组中超出新长度后面的元素
 */

//双指针直接遍历，时间复杂度O(N),空间复杂度O(1)
var removeDuplicates = function(nums) {
  if (nums == null || nums.length == 0) return 0;
  let p = 0; //慢指针
  let q = 1; //快指针
  while (q < nums.length) {
    if (nums[p] != nums[q]) {
      nums[p + 1] = nums[q];
      p++;
    }
    q++;
  }
  return p + 1;
};

```
