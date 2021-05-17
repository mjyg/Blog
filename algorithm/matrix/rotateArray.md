```js
/*题目：给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。*/

//方法1：暴力旋转，旋转k次，每次旋转1个元素
//时间复杂度O(k*n),空间复杂度O(1)
function k(nums, k) {
  const len = nums.length;
  for (let i = 0; i < k % len; i++) {
    const last = nums[len - 1]; //保存最后一个元素，后面的元素依次前移一个
    for (let j = len - 2; j >= 0; j--) {
      nums[j + 1] = nums[j];
    }
    nums[0] = last; //移动最后一个元素到第一个元素
  }
}

//方法2：使用额外的数组，遍历一次，每次把nums的元素拷贝到额外数组正确的位置
//时间复杂度O(n),空间复杂度O(n)
function rotateArray(nums, k) {
  const temp = [];
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    const p = (i + k) % len;
    temp[p] = nums[i];
  }
  for (let i = 0; i < len; i++) {
    nums[i] = temp[i];
  }
}

//方法3：环状替换：把第一个元素放到正确的位置，被占位的元素保存到临时变量，再把该元素放到正确的位置，
// 下一个被占位的元素保存到临时变量，依次循环下去。。。已经处理过该元素时，循环从第一个元素
// 的下一个元素开始，直到处理完所有的元素
//时间复杂度O(n),空间复杂度O(1)
function rotateArray(nums, k) {
  let start = 0;
  const len = nums.length;
  let count = 0;

  while (count < len) {
    let cur = start;
    let temp = nums[cur]; //保存被占位的元素

    //先执行一次，再循环
    do {
      let p = (cur + k) % len;
      const t = nums[p];
      nums[p] = temp; //把占位元素放到正确的位置
      temp = t; //保存被占位的元素

      cur = p;
      count++; //已处理的被占位的元素个数，控制外层循环次数
    } while (start !== cur && count < len); //注意，当start === cur的时候不可能出现count > len, 这里 count < len可以不加
    start = start + 1; //下一次外层循环开始
    console.log(nums);
  }
}

//方法4：翻转数组：先整体翻转一次，再翻转前k个元素的子数组和后n-k个元素的子数组
//时间复杂度O(n),空间复杂度O(1)
function rotateArray(nums, k) {
  const len = nums.length;
  k = k % len;
  if (k === 0 || len === 1) return;
  const last = len - 1;
  rollupArr(nums, 0, last);
  rollupArr(nums, 0, k - 1);
  rollupArr(nums, k, last);
}

function rollupArr(nums, start, last) {
  for (let i = start; i <= start + (((last - start) / 2) >>> 0); i++) {
    const temp = nums[i];
    nums[i] = nums[last - i + start];
    nums[last - i + start] = temp;
  }
}

```
