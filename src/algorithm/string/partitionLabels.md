```js
/*
字符串 S 由小写字母组成。我们要把这个字符串划分为尽可能多的片段，同一个字母只会出现在其中的一个片段。返回一个表示每个字符串片段的长度的列表。
示例 1：
输入：S = "ababcbacadefegdehijhklij"
输出：[9,7,8]
解释：
划分结果为 "ababcbaca", "defegde", "hijhklij"。
每个字母最多出现在一个片段中。
像 "ababcbacadefegde", "hijhklij" 的划分是错误的，因为划分的片段数较少。

提示：
S的长度在[1, 500]之间。
S只包含小写字母 'a' 到 'z' 。
 */


//思路：先找出每一个字符出现的最后的位置，再遍历整个字符串，如果当前的下标正好是前面出现的字符中最后位置最
//大的数，则说明后面不会再有前面的字符出现，即可判断该下标之前的字符串为一个最小片段
//时间复杂度：O（n），空间复杂度：O（n）
/**
 * @param {string} S
 * @return {number[]}
 */
var partitionLabels = function(S) {

  //找出每个字符出现的最后位置
  var last = {}
  for(let i = 0; i < S.length; i++) {
    if(last[S[i]] === undefined || last[S[i]] < i)last[S[i]] = i
  }

  let end = 0
  let re = []
  let start = 0
  //遍历整个字符串
  for(let i = 0; i < S.length; i++){
    end = Math.max(end, last[S[i]]) //记住前面字符出现的最后位置中最大的数

    //找到最小片段的下标
    if(end === i) {
      re.push(end - start + 1)
      start = i + 1
    }
  }
  return re
};

var S = 'ababcbacadefegdehijhklij';
console.log(partitionLabels(S));

```
