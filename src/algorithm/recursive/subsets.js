/*
给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
示例 1：
输入：nums = [1,2,3]
输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
示例 2：
输入：nums = [0]
输出：[[],[0]]
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function (nums) {
  // dps深度遍历：对每一层元素可以选或不选，把结果放入res,再进一步dps
  const res = [[]];
  const cur = [];
  // const visited = [];
  const len = nums.length;

  dps(0);

  function dps(index) {
    // if (cur.length === len) {  //  这里可以不需要递归的出口,因为nth是递增的,下面的循环会自动结束
    //   return;
    // }

    // 结果集不能出现相同字符不同顺序的组合，所以每层遍历从下一个元素开始
    for (let i = index; i < len; i++) {
      // if (!visited[nums[i]]) {  //因为每层遍历从下一个元素开始，所以不需要判断是否已经访问过
        cur.push(nums[i]);
        // visited[nums[i]] = 1;
        res.push([...cur]);

        dps(i + 1);

        cur.pop();
        // visited[nums[i]] = 0;
      // }
    }
  }

  return res;
};

console.log(subsets([1, 2, 3]));
