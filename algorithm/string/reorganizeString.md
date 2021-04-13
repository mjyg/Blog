```js
/*
给定一个字符串S，检查是否能重新排布其中的字母，使得两相邻的字符不同。
若可行，输出任意可行的结果。若不可行，返回空字符串。
示例 1:
输入: S = "aab"
输出: "aba"
示例 2:
输入: S = "aaab"
输出: ""
注意:
S 只包含小写字母并且长度在[1, 500]区间内。
*/
/**
 * @param {string} S
 * @return {string}
 */
var reorganizeString = function(S) {
  //如果要使'aaabc'两两字符不相邻，那么一定要这样放'abaca',就是说出现最多的a必须放在偶数位，且a的个数的最大值
  //必须是(S.length+1)>>1

  //统计每个字符出现的次数
  let numObj = {};
  for (const ch of S) {
    numObj[ch] = (numObj[ch] || 0) + 1;
  }

  //求出现最多次数的字符和次数
  let maxChar = '';
  let maxNum = 0;
  for (const key of Object.keys(numObj)) {
    if (maxNum < numObj[key]) {
      maxChar = key;
      maxNum = numObj[key];
    }
    if (maxNum > (S.length + 1) >> 1) return '';
  }

  //先把maxChar放在偶数位，拼成新字符串
  const re = [];
  let i = 0;
  for (; i < S.length && numObj[maxChar] > 0; i += 2) {
    re[i] = maxChar;
    numObj[maxChar]--;
  }

  //继续放剩下的字符，先把偶数位放完，再放奇数位
  for (const key of Object.keys(numObj)) {
    while (numObj[key]-- > 0) {
      if (i >= S.length) i = 1;
      re[i] = key;
      i += 2;
    }
  }
  return re.join('');
};

console.log(reorganizeString('bfrbs'));

```
