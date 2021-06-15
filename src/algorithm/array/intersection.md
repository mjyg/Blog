```js
/*
给定两个数组，编写一个函数来计算它们的交集。
示例 1：
输入：nums1 = [1,2,2,1], nums2 = [2,2]
输出：[2]
示例 2：
输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出：[9,4]
说明：
输出结果中的每个元素一定是唯一的。
我们可以不考虑输出结果的顺序。
 */
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
  if(!nums1.length || !nums2.length) return []

  const re = [];

  //保存第一个数组为键值对
  const obj1 = {};
  for (const item of nums1) {
    obj1[item] = 1;
  }

  //第二个数组的元素在第一个数组中是否有值
  for(const item of nums2) {
    if(obj1[item] === 1) {
      re.push(item)
      obj1[item]++;  //该数已经出现过
    }
  }

  return re;
};


//方法二，使用Set
const set_intersection = (set1, set2) => {
  if (set1.size > set2.size) {
    return set_intersection(set2, set1);
  }
  const intersection = new Set();
  for (const num of set1) {
    if (set2.has(num)) {
      intersection.add(num);
    }
  }
  return [...intersection];
}

var intersection2 = function(nums1, nums2) {
  const set1 = new Set(nums1);
  const set2 = new Set(nums2);
  return set_intersection(set1, set2);
};


console.log(intersection([4,9,5], [9,4,9,8,4]))

```
