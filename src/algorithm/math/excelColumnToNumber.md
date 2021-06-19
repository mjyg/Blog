```js
//思路：转成26进制数
function excel(n) {
  let re = '';
  while (n > 0) {
    if (n % 26 === 0) {
      re = 'Z' + re;
      n = ((n / 26) >>> 0) - 1; //如果是Z，那么上一位要减1,52=>AZ
    } else {
      re = String.fromCharCode((n % 26) - 1 + 'A'.charCodeAt()) + re;
      n = (n / 26) >>> 0;
    }
  }
  return re;
}

function excelColumnToNumber(s) {
  let re = 0;
  for (let i = 0; i < s.length; i++) {
    const temp = s[i].charCodeAt() - 'A'.charCodeAt() + 1; //A从1开始，每一位要加1
    re = re * 26 + temp;
  }
  return re;
}

```
