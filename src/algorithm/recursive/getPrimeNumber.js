/*
算法题：获取数字的质数组合数组
input: 10 output: [2,5]
input: 20 output: [2,2,5]
 */

// 是否是质数
function isPrime(num) {
  if (num < 3) return true;
  for (let i = 2; i < num; i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

function getPrimeNumber(input) {
  const res = [];
  const mid = input / 2;
  const dfs = (num, base) => {
    if (base > mid) return;

    if (num % base === 0 && isPrime(base)) {
      // 如果能整除且base是质数，保存base,取商继续从2开始递归
      res.push(base);
      dfs(num / base, 2);
    } else {
      //如果不能整除或base不是质数，base+1再在原来的数上递归
      dfs(num, base + 1);
    }
  };
  dfs(input, 2);  // 从2开始，因为2是最小的质数
  return res;
}

console.log(getPrimeNumber(20));
