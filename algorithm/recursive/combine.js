/*
给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合。
示例:
输入: n = 4, k = 2
输出:
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
 */
/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function(n, k) {
  const res = [];
  const subset = [];
  dfs(1)
  function dfs(index) {
    // 剪枝：当subset的长度与k相等时，不需要再dps
    if(subset.length === k) {
      res.push([...subset])
      return;
    }
    for(let i = index; i <=n; i++) {
      //当前数字放入subset中
      subset.push(i)
      // 继续dfs
      dfs(i+1)
      // pop当前数字
      subset.pop()
    }
  }

  return res;
};


console.log(combine(3,2))
