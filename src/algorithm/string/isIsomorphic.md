```js
/*
给定两个字符串 s 和 t，判断它们是否是同构的。
如果 s 中的字符可以被替换得到 t ，那么这两个字符串是同构的。
所有出现的字符都必须用另一个字符替换，同时保留字符的顺序。两个字符不能映射到同一个字符上，但字符可以映射自己本身。
示例 1:
输入: s = "egg", t = "add"
输出: true
示例 2:
输入: s = "foo", t = "bar"
输出: false
 */
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isIsomorphic = function(s, t) {
  //哈希表
  const obj1 = {};
  const obj2 = {};
  for (let i = 0; i < s.length; i++) {
    const si = s[i];
    const ti = t[i];
    if (!obj1[si]) {
      obj1[si] = ti;
    }
    if (!obj2[ti]) {
      obj2[ti] = si;
    }
    if ((obj1[si] && obj1[si] !== ti) || (obj2[ti] && obj2[ti] !== si)) return false;
  }
  return true;
};

var isIsomorphic2 = function(s, t) {
  //数组，数组比哈希表快
  const arr1 = [];
  const arr2 = [];
  for (let i = 0; i < s.length; i++) {
    const si = s.charCodeAt(i) - 'a'.charCodeAt() + 1;
    const ti = t.charCodeAt(i) - 'a'.charCodeAt() + 1;
    if (!arr1[si]) {
      arr1[si] = ti;
    }
    if (!arr2[ti]) {
      arr2[ti] = si;
    }
    console.log(arr1, arr2);
    if ((arr1[si] && arr1[si] !== ti) || (arr2[ti] && arr2[ti] !== si)) return false;
  }
  return true;
};

console.log(isIsomorphic2('aba', 'aca'));

```
