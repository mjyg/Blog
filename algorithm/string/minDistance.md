```js
/*
给你两个单词 word1 和 word2，请你计算出将 word1 转换成 word2 所使用的最少操作数 。
可以对一个单词进行如下三种操作：
插入一个字符
删除一个字符
替换一个字符

示例 1：
输入：word1 = "horse", word2 = "ros"
输出：3
解释：
horse -> rorse (将 'h' 替换为 'r')
rorse -> rose (删除 'r')
rose -> ros (删除 'e')
 */
var minDistance = function(word1, word2) {
  let l1 = word1.length;
  let l2 = word2.length;

  //有个字符串为空串
  if(!l1 || !l2) return l1 || l2;

  //初始化dp为二维数组
  let dp = []
  for(let i =0;i <= l1;i++) {
    dp.push([])
  }

  //初始化边界值
  for(let i = 0; i<=l1;i++) dp[i][0] = i
  for(let j = 0; j<=l2;j++) dp[0][j] = j

  //生成dp数组
  for(let i =1;i <= l1;i++) {
    for(let j =1;j<=l2;j++) {
       if (word1[i-1] === word2[j-1]) {
         //字符相同时
         dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1])
       } else {
         //字符不同时
         dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1)
       }
    }
  }
  console.log(dp)
  return dp[l1][l2]
};
//时间复杂度 ：O(mn)，其中 m 为 word1 的长度，n 为 word2 的长度。
// 空间复杂度 ：O(mn)，我们需要大小为 O(mn) 的 DD 数组来记录状态值


console.log(minDistance('horse', 'ros'))

```
