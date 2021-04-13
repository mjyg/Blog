```js
/*
在一个由小写字母构成的字符串 s 中，包含由一些连续的相同字符所构成的分组。
例如，在字符串 s = "abbxxxxzyy" 中，就含有 "a", "bb", "xxxx", "z" 和 "yy" 这样的一些分组。
分组可以用区间 [start, end] 表示，其中 start 和 end 分别表示该分组的起始和终止位置的下标。上例中的 "xxxx" 分组用区间表示为 [3,6] 。
我们称所有包含大于或等于三个连续字符的分组为 较大分组 。
找到每一个 较大分组 的区间，按起始位置下标递增顺序排序后，返回结果。
 */
/*
输入：s = "abbxxxxzzy"
输出：[[3,6]]
解释："xxxx" 是一个起始于 3 且终止于 6 的较大分组。
 */
/**
 * @param {string} s
 * @return {number[][]}
 */
var largeGroupPositions = function(s) {
  if (!s.length) return [];
  let cur = s[0];
  let i = 0;
  let re = [];
  let sub = [0, 0];
  while (i < s.length) {
    if (cur === s[i]) {
      sub[1] = i;
    } else {
      if (sub[1] - sub[0] >= 2) {
        re.push([sub[0], sub[1]]);
      }
      sub[0] = i;
      cur = s[i];
    }
    i++;
  }

  //最后一串字符是较大分组
  if (sub[1] - sub[0] >= 2) {
    re.push([sub[0], sub[1]]);
  }

  return re;
};

console.log(largeGroupPositions('aaa'));

```
