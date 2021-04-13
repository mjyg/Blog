```js
/*
给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。

示例 1:
输入: num1 = "2", num2 = "3"
输出: "6"
示例 2:
输入: num1 = "123", num2 = "456"
输出: "56088"
说明：
num1 和 num2 的长度小于110。
num1 和 num2 只包含数字 0-9。
num1 和 num2 均不以零开头，除非是数字 0 本身。
不能使用任何标准库的大数类型（比如 BigInteger）或直接将输入转换为整数来处理。
 */

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function(num1, num2) {
  if(num1 === '0' || num2 === '0') return '0'

  let re = []; //使用数组存乘积，直接用数字可能会超过MAX_SAFE_INTEGER导致结果不准确

  //反转输入
  const n1 = num1.split('').reverse()
  const n2 = num2.split('').reverse()

  for(let i = 0; i < n1.length; i ++) {
    for (let j = 0; j < n2.length; j ++){
      if(re[i + j] === undefined) re[i + j] = 0
      const temp = re[i + j] + n2[j] * n1[i]; //这里还要加上上一次计算的值

      //放入结果
      re[i + j] = temp % 10

      //有进位需要放入进位
      if(temp > 9) {
        if (re[i + j + 1] === undefined) re[i + j + 1] = 0
        re[i + j + 1] += (temp / 10) >> 0
      }
    }
  }
  return re.reverse().join('')
};

console.log(multiply('123456789', '987654321'))


```
