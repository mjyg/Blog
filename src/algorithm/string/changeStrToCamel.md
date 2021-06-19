```js
/*
手写给个xiaotuofeng-mingming-shezhi改成驼峰式xiaotuofengMingmingShezhi
 */
function changeStrToCamel(str) {
  const chars = str.split('');
  for (let i = 0; i < chars.length - 1; i++) {
    if (chars[i] === '-') {
      chars.splice(i, 2, chars[i + 1].toUpperCase());
    }
  }
  return chars.join('');
}

console.log(changeStrToCamel('xiaotuofeng-mingming-shezhi'));

```
