```js
/*
给定一种规律 pattern 和一个字符串 str ，判断 str 是否遵循相同的规律。
这里的 遵循 指完全匹配，例如， pattern 里的每个字母和字符串 str 中的每个非空单词之间存在着双向连接的对应规律。
示例1:
输入: pattern = "abba", str = "dog cat cat dog"
输出: true
示例 2:
输入:pattern = "abba", str = "dog cat cat fish"
输出: false
 */
/**
 * @param {string} pattern
 * @param {string} s
 * @return {boolean}
 */
var wordPattern = function(pattern, s) {
  /*
  时间复杂度：O(n + m)，插入和查询哈希表的均摊时间复杂度均为O(n+m)。每一个字符至多只被遍历一次。
  空间复杂度：O(n + m)，最坏情况下，我们需要存储pattern 中的每一个字符和str 中的每一个字符串。
   */
  const dict = new Map();
  const words = s.split(' ');
  const valueDict = new Map();
  if (pattern.length !== words.length) return false;
  for (let i = 0; i < pattern.length; i++) {
    if (!dict.has(pattern[i])) {
      if (!valueDict.has(words[i])) {
        //word不能有重复
        dict.set(pattern[i], words[i]);
        valueDict.set(words[i], true);
      } else {
        return false;
      }
    } else {
      if (dict.get(pattern[i]) !== words[i]) return false;
    }
  }
  return true;
};

var wordPattern2 = function(pattern, s) {
  /*
  时间复杂度：O(n + m)，插入和查询哈希表的均摊时间复杂度均为O(n+m)。每一个字符至多只被遍历一次。
  空间复杂度：O(n + m)，最坏情况下，我们需要存储pattern 中的每一个字符和str 中的每一个字符串。
   */
  const word2ch = new Map();
  const ch2word = new Map();
  const words = s.split(' ');
  if (pattern.length !== words.length) {
    return false;
  }
  for (const [i, word] of words.entries()) {
    const ch = pattern[i];
    if (
      (word2ch.has(word) && word2ch.get(word) != ch) ||
      (ch2word.has(ch) && ch2word.get(ch) !== word)
    ) {
      return false;
    }
    word2ch.set(word, ch);
    ch2word.set(ch, word);
  }
  return true;
};

const pattern = 'abba',
  str = 'dog dog dog dog';

console.log(wordPattern(pattern, str));

```
