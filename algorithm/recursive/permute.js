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
var permutate = function (nums) {
  const re = [];
  perm(nums, 0, nums.length - 1);

  // 递归算法:任取一个数打头，对后面n-1个数进行全排序，要求n-1个数的全排序，则要求n-2个数的全排序……
  // 直到要求的全排序只有一个数，找到出口。
  function perm(nums, k, m) {
    if (k === m) {
      re.push([...nums]); //全排列只有一个数，输出
    } else {
      for (let i = k; i <= m; i++) {
        //遍历m~n个数，每次以a[i]打头
        swap(nums, k, i); //把打头的数放在最开始的位置
        perm(nums, k + 1, m);
        swap(nums, k, i); // 避免重复排序，每个数打头结束后都恢复初始排序
      }
    }
  }
  return re;
};

function swap(nums, m, n) {
  const temp = nums[m];
  nums[m] = nums[n];
  nums[n] = temp;
}

var permutate2 = function (nums) {
  // 构造一棵树，用深度遍历法
  // 每层对所有元素遍历，如果未被使用，则加入当前序列，当当前序列长度和nums长度相等，放入结果数组
  // ，同时把该元素从当前序列中删除，清除标记
  const res = [];
  const cur = []; //当前序列
  const visited = []; //标记序列中已被使用的元素

  dfs();

  function dfs() {
    // 当前序列长度和nums相等，保存cur，递归出口
    if (cur.length === nums.length) {
      res.push([...cur]); //注意这里一定要浅拷贝
      return;
    }

    // 每层中处理每个元素，结果集能出现相同字符不同顺序的组合，所以每层遍历都从第一个元素开始
    for (let i = 0; i < nums.length; i++) {
      //该数字未被使用
      if (!visited[nums[i]]) {
        cur.push(nums[i]);
        visited[nums[i]] = 1; //标记已经使用

        // 在当前序列的基础上，寻找下一个数字
        dfs();

        cur.pop(); //弹出当前元素
        visited[nums[i]] = 0; //撤销标记
      }
    }
  }
  return res;
};

console.log(permutate2([1, 2]));
