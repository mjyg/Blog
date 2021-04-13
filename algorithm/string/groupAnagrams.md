```js
/*
给定一个字符串数组，将字母异位词组合在一起。字母异位词指字母相同，但排列不同的字符串。
示例:
输入: ["eat", "tea", "tan", "ate", "nat", "bat"]
输出:
[
  ["ate","eat","tea"],
  ["nat","tan"],
  ["bat"]
]
说明：
所有输入均为小写字母。
不考虑答案输出的顺序。
 */
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
  const obj = new Map(); //记录相同字符的位置
  const re = [];
  for (const str of strs) {
    const sortStr = str.split('').sort();
    if (obj[sortStr] === undefined) {
      obj[sortStr] = re.length; //相同字符不存在，记录位置
      re[re.length] = [str];
    } else {
      re[obj[sortStr]].push(str);
    }
  }
  return re;
};
console.log(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']));

```
