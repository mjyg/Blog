/*
给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。
示例 1:
输入: "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 */

// 使用一个数组来维护滑动窗口，遍历字符串，判断字符是否在滑动窗口中
// 如果不在，则直接放入滑动窗口
// 如果在，则删除滑动窗口相同字符及之前的所有元素
// 更新最大长度
function lengthOfLongestSubstring(str) {
  let max = 0;
  let start = 0;
  let end = -1;
  for(let i = 0; i < str.length; i++) {
    for(let j = start; j <= end; j ++) {
      if(str[i] === str[j]) {
        start = j + 1;
        break;
      }
    }
    end ++;
    max = Math.max(max, end - start + 1)  //更新长度
  }
  return max
}

//解法二：以空间换时间，使用一个map来维护遍历过的字符下标，充当滑动窗口的角色，如果存在该字符，更新下标，且start + 1
function lengthOfLongestSubstring2(str) {
  const map = new Map();
  let re = 0,start = -1;
  for(let i = 0; i < str.length; i ++) {
    const ch = str[i]
    if(map.has(ch)) {
      start =  start + 1
    }
    map.set(ch, i)
    re = Math.max(i - start, re)
  }
  return re;
}



console.log(lengthOfLongestSubstring("abcabcbb"))

