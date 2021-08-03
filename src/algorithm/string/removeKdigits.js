/*
一个数字字符串，从中截取连续的几个，找到剩余的最小值
例子： str = '12345', n = 2, 最小值为123
例子： str = '10500' n = 1, 最小值为500
 */

var removeKdigits = function (num, k) {
  let min = Number(num.substring(0, num.length - k));
  for (let i = 0; i < num.length; i++) {
    const number = Number(num.substring(0, i) + num.substring(i + k, num.length));
    min = Math.min(number, min);
  }
  return min.toString();
};

console.log(removeKdigits('10500', 1)); // 500
