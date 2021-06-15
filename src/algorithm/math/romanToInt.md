```js
// Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
//
//   Symbol       Value
// I             1
// V             5
// X             10
// L             50
// C             100
// D             500
// M             1000

/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
  const obj = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  }
  let re = 0
  for (let i = 0; i < s.length; i++) {
    let low = obj[s[i]]
    let high = obj[s[i + 1]]
    if (low < high) {
      re -= low
    } else {
      re += low
    }
  }
  return re
}

console.log(romanToInt('MCMXCIV'))

```
