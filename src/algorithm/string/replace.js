// a,b,c是三个字符串，把a中的b都替换成c,直到a中没有b为止，不能使用字符串的查找、比较、替换函数

function replace(a, b, c) {
  let i = -1;
  const bLen = b.length;
  while (++i < a.length) {
    if(isEqual(a, i, i + bLen, b)){
      a = slice(a, 0, i) + c + slice(a, i + bLen, a.length);
      i--;  // 每次替换后从当前字符开始，需要减1,因为有可能替换后的字符和后面的字符又可以替换
      console.log(i,a)
    }
  }
  return a;
}

// 截取字符串
function slice(a, start, end) {
  let re = '';
  while (start < end) {
    re += a[start++];
  }
  return re;
}

// 字符串是否相等
function isEqual(a, start, end, b) {
  let i = 0
  while (start < end && a[start] === b[i++]) {
    start++;
  }
  return start === end;
}

console.log(replace('abcbcdzabc', 'abc', 'a'));  // adza
