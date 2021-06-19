```js
/*
给你一份『词汇表』（字符串数组） words 和一张『字母表』（字符串） chars。
假如你可以用 chars 中的『字母』（字符）拼写出 words 中的某个『单词』（字符串），那么我们就认为你掌握了这个单词。
注意：每次拼写（指拼写词汇表中的一个单词）时，chars 中的每个字母都只能用一次。
返回词汇表 words 中你掌握的所有单词的长度之和。
示例 1：
输入：words = ["cat","bt","hat","tree"], chars = "atach"
输出：6
解释：
可以形成字符串 "cat" 和 "hat"，所以答案是 3 + 3 = 6。
1 <= words.length <= 1000
1 <= words[i].length, chars.length <= 100
所有字符串中都仅包含小写英文字母
 */

// 1.生成包含字母表里所有字母计数的数组；
// 2.遍历每个单词的字母,在字母数组对应下标找到（字母计数不为0）则该字母计数-1，若字母计数位0，
//   说明不能形成该单词
//时间复杂度O(N),空间复杂度O(1)
var countCharacters = function(words, chars) {
  let length = 0;

  // 1.生成包含字母表里所有字母计数的数组；
  const charList = [];
  for (let i = 0; i < chars.length; i++) {
    const index = chars[i].charCodeAt() - 97;
    if (typeof charList[index] !== 'number') charList[index] = 0;
    charList[index]++;
  }

  // 2.遍历每个单词的字母,在字母数组对应下标找到（字母计数不为0）则该字母计数-1，若字母计数位0，
  //   说明不能形成该单词
  for (let i = 0; i < words.length; i++) {
    let find = true;
    let charListCopy = [...charList]; //需要使用字母表的副本
    for (let j = 0; j < words[i].length; j++) {
      const index = words[i][j].charCodeAt() - 97;
      if (typeof charListCopy[index] === 'number' && charListCopy[index] > 0) {
        charListCopy[index]--;
      } else {
        find = false;
        break;
      }
    }
    if (find) length += words[i].length;
  }
  return length;
};

```
