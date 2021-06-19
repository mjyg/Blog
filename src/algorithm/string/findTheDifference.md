```js
/*
给定两个字符串 s 和 t，它们只包含小写字母。
字符串 t 由字符串 s 随机重排，然后在随机位置添加一个字母。
请找出在 t 中被添加的字母。
示例 1：
输入：s = "abcd", t = "abcde"
输出："e"
解释：'e' 是那个被添加的字母。
示例 2：
输入：s = "", t = "y"
输出："y
 */
/**
 * @param {string} s
 * @param {string} t
 * @return {character}
 */
var findTheDifference = function(s, t) {
  //计数法：空间复杂度O（N），时间复杂度O（N）
  const obj = {};
  for (const ch of s) {
    obj[ch] = (obj[ch] || 0) + 1;
  }
  for (const ch of t) {
    if (obj[ch]) {
      obj[ch]--;
    } else {
      return ch;
    }
  }
};

var findTheDifference2 = function(s, t) {
  //ASCII码相加再减，多出来的数转为ASCII码就是多出的字符
  //空间复杂度O（1），时间复杂度O（N）
  let num1 = 0,
    num2 = 0;
  for (const ch of s) {
    num1 += ch.charCodeAt();
  }
  for (const ch of t) {
    num2 += ch.charCodeAt();
  }
  return String.fromCharCode(num2 - num1);
};

var findTheDifference3 = function(s, t) {
  //如果将两个字符串拼成一个字符串，问题转为求出现次数为奇数的字符
  //字符中的全部元素的ASCII码异或运算（相同为0，不同为1）结果即为出现次数为奇数的字符。
  //空间复杂度O（1），时间复杂度O（N）
  let num = 0;
  for (const ch of s) {
    num ^= ch.charCodeAt();
  }
  for (const ch of t) {
    num ^= ch.charCodeAt();
  }
  return String.fromCharCode(num);
};
console.log(findTheDifference3('ab', 'aba'));

```
