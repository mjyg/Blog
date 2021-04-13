```js
/*
给定一个非负整数 num。对于 0 ≤ i ≤ num 范围中的每个数字 i ，计算其二进制数中的 1 的数目并将它们作为数组返回。
示例 1:
输入: 2
输出: [0,1,1]
 */
/**
 * @param {number} num
 * @return {number[]}
 */
var countBits = function(num) {
  const re = []
  for(let i = 0; i<=num; i++) {
    const str = i.toString(2)
    let count = 0;
    for(let c of str) {
      if(c==='1') {
        count ++
      }
    }
    re.push(count)
  }
  return re
};

/*
对于所有的数字，只有两类：
奇数：二进制表示中，奇数一定比前面那个偶数多一个 1，因为多的就是最低位的 1。
偶数：二进制表示中，偶数中 1 的个数一定和除以 2 之后的那个数一样多。因为最低位是 0，除以 2 就是右
移一位，也就是把那个 0 抹掉而已，所以 1 的个数是不变的。
 */
var countBits2 = function(num) {
  const re = [0]
  for(let i =1 ; i <= num; i++) {
    if(i & 1) {
      re.push(re[i-1] +1)
    } else {
      re.push(re[i/2])
    }
  }
  return re
};


console.log(countBits2(2))

```
