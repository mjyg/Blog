```js
//快速排序
function quickSort(s, start, end) {
  if (start >= end) return;
  const flag = s[start]; //哨兵
  let i = start;
  let j = end;
  while (i < j) {
    while (i < j && s[j] > flag) j--;
    while (i < j && s[i] <= flag) i++;
    //大值放右边，小值放左边
    if (i < j) {
      const temp = s[i];
      s[i] = s[j];
      s[j] = temp;
    }
  }
  //调整基准位置
  s[start] = s[i];
  s[i] = flag;
  quickSort(s, start, i - 1);
  quickSort(s, i + 1, end);
  return s;
}

```
