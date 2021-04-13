```js
/*
给定一个字符串，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 -1。
示例：
s = "leetcode"
返回 0
s = "loveleetcode"
返回 2
提示：你可以假定该字符串只包含小写字母。
 */
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function(s) {
  let arr = [];
  let n = s.length;
  //记录每个字符出现的次数
  for (let i = 0; i < n; i++) {
    const index = s.charCodeAt(i) - 97;
    arr[index] = (arr[index] || 0) + 1;
  }

  //遍历字符，找到第一个次数为1的字符
  for (let i = 0; i < n; i++) {
    if (arr[s.charCodeAt(i) - 97] === 1) return i;
  }
  return -1;
};

console.log(firstUniqChar('bbbccze'));

```
