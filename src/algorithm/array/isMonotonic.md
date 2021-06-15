```js
/*
如果数组是单调递增或单调递减的，那么它是单调的。
如果对于所有 i <= j，A[i] <= A[j]，那么数组 A 是单调递增的。 如果对于所有 i <= j，A[i]> = A[j]，那么数组 A 是单调递减的。
当给定的数组 A 是单调数组时返回 true，否则返回 false。
 */
/**
 * @param {number[]} A
 * @return {boolean}
 */
var isMonotonic = function (A) {
  if (A.length <= 2) return true;
  let i = 1;
  while(i < A.length &&A[i] === A[i-1]) i ++
  if(i=== A.length) return true
  if (A[i-1] < A[i]) {
    while (i < A.length && A[i - 1] <= A[i]) {
      i++;
    }
    if (i === A.length) return true;
    return false;
  }
  if (A[i-1] > A[i]) {
    while (i < A.length && A[i - 1] >= A[i]) {
      i++;
    }
    if (i === A.length) return true;
    return false;
  }
};

//遍历数组 AA，若既遇到了 A[i]>A[i+1]又遇到了 A[i']<A[i'+1]，则说明 AA 既不是单调递增的，也不是单调递减的
var isMonotonic2 = function(A) {
  let inc = true, dec = true;
  const n = A.length;
  for (let i = 0; i < n - 1; ++i) {
    if (A[i] > A[i + 1]) {
      inc = false;
    }
    if (A[i] < A[i + 1]) {
      dec = false;
    }
  }
  return inc || dec;
};


console.log(isMonotonic([1,1,0]));

```
