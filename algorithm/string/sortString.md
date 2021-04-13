```js
/*
给你一个字符串 s ，请你根据下面的算法重新构造字符串：
从 s 中选出 最小 的字符，将它 接在 结果字符串的后面。
从 s 剩余字符中选出 最小 的字符，且该字符比上一个添加的字符大，将它 接在 结果字符串后面。
重复步骤 2 ，直到你没法从 s 中选择字符。
从 s 中选出 最大 的字符，将它 接在 结果字符串的后面。
从 s 剩余字符中选出 最大 的字符，且该字符比上一个添加的字符小，将它 接在 结果字符串后面。
重复步骤 5 ，直到你没法从 s 中选择字符。
重复步骤 1 到 6 ，直到 s 中所有字符都已经被选过。
在任何一步中，如果最小或者最大字符不止一个 ，你可以选择其中任意一个，并将其添加到结果字符串。
请你返回将 s 中字符重新排序后的 结果字符串 。
1 <= s.length <= 500
s 只包含小写英文字母。*/
/*
示例 1：
输入：s = "aaaabbbbcccc"
输出："abccbaabccba"
解释：第一轮的步骤 1，2，3 后，结果字符串为 result = "abc"
第一轮的步骤 4，5，6 后，结果字符串为 result = "abccba"
第一轮结束，现在 s = "aabbcc" ，我们再次回到步骤 1
第二轮的步骤 1，2，3 后，结果字符串为 result = "abccbaabc"
第二轮的步骤 4，5，6 后，结果字符串为 result = "abccbaabccba"
 */
/**
 * @param {string} s
 * @return {string}
 */
var sortString = function(s) {
  //数组作哈希表，字节的unicode编码 - 97作索引，存字节出现次数
  // 顺序遍历数组，就是从小到大，选字节，倒序，就是从大到小选
  const arr = [];
  for (const ch of s) arr[(i = ch.charCodeAt() - 97)] = (arr[i] || 0) + 1;

  let re = '';
  while (re.length < s.length) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        re += String.fromCharCode(i + 97);
        arr[i] = arr[i] - 1;
      }
    }
    for (let j = arr.length - 1; j >= 0; j--) {
      if (arr[j]) {
        re += String.fromCharCode(j + 97);
        arr[j] = arr[j] - 1;
      }
    }
  }
  return re;
};

console.log(sortString('abccbaabccbaeef'));

```
