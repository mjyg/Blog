```js
/*
编写一个函数来查找字符串数组中的最长公共前缀。
如果不存在公共前缀，返回空字符串 ""。
示例 1：
输入：strs = ["flower","flow","flight"]
输出："fl"
 */

/**
 * @param {string[]} strs
 * @return {string}
 */
let longestCommonPrefix = function(strs) {
  const len = strs.length;
  if (len === 0) {
    return '';
  }
  if (len === 1) {
    return strs[0];
  }
  let flagStr = strs[0];
  let temp = '';
  for (let i = 1; i< strs.length; i ++) {
    const str = strs[i];
    let j = 0;
    while (j < flagStr.length && j < str.length && flagStr[j] === str[j]) {
      temp += flagStr[j];
      j ++;
    }
    if (temp === '') {  //没有相同前缀
      return '';
    } else {
      flagStr = temp;
      temp = '';
    }
  }
  return flagStr;
};

//方法二: 先给数组排序，再比较首位两个字符串的前缀即可，空间复杂度更小
let longestCommonPrefix2 = function(strs) {
  const len = strs.length;
  if (len === 0) {
    return '';
  }
  if (len === 1) {
    return strs[0];
  }
  strs = strs.sort(compare);
  const str1 = strs[0];
  const str2 = strs[len - 1];
  let i = 0;
  let re = '';
  while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
    re += str1[i];
    i ++;
  }
  return re;
};

function compare(a, b) {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}

console.log(longestCommonPrefix2(["flower","flight","flow"]));

```
