```js
/*
给出由小写字母组成的字符串 S，重复项删除操作会选择两个相邻且相同的字母，并删除它们。
在 S 上反复执行重复项删除操作，直到无法继续删除。
在完成所有重复项删除操作后返回最终的字符串。答案保证唯一。
 */
/*
输入："abbaca"
输出："ca"
解释：
例如，在 "abbaca" 中，我们可以删除 "bb" 由于两字母相邻且相同，这是此时唯一可以执行删除操作的重复项。之后我们得到字符串 "aaca"，其中又只有 "aa" 可以执行重复项删除操作，所以最后的字符串为 "ca"。
 */

/**
 * @param {string} S
 * @return {string}
 */
var removeDuplicates = function(S) {
  // 用一个栈保存不重复的元素 ，遍历数组，只要栈顶元素和数组元素相同则pop栈顶元素；否则把数组元素push入栈
  const stk = []
  for(const c of S) {
    if(stk.length && c == stk[stk.length - 1]) {
     stk.pop()
    } else {
      stk.push(c)
    }
  }
  return stk.join('')
};

console.log(removeDuplicates('abbaca'))

```
