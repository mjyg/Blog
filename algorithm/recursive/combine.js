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
var combine = function (n, k) {
  // 构造一棵树，用深度遍历方法
  const res = [];
  const cur = [];
  dfs(1);  //遍历第一层
  function dfs(index) {
    // 剪枝：当cur的长度与k相等时，存入结果,同时不需要再dps
    if (cur.length === k) {
      res.push([...cur]);
      return;
    }

    // 对每层的数字遍历，结果集不能出现相同字符不同顺序的组合，所以每层遍历从下一个元素开始
    for (let i = index; i <= n; i++) {
      //当前数字放入cur中
      cur.push(i);
      // 继续dfs
      dfs(i + 1);  // 遍历下一层
      // pop当前数字
      cur.pop();
    }
  }

  return res;
};

console.log(combine(3, 2));
