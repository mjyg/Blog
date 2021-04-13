```js
/*
给定一个整数数组 prices，其中第 i 个元素代表了第 i 天的股票价格 ；非负整数 fee 代表了交易股票的手续费用。
你可以无限次地完成交易，但是你每笔交易都需要付手续费。如果你已经购买了一个股票，在卖出它之前你就不能再继续购买股票了。
返回获得利润的最大值。
注意：这里的一笔交易指买入持有并卖出股票的整个过程，每笔交易你只需要为支付一次手续费。
 */
/*
输入: prices = [1, 3, 2, 8, 4, 9], fee = 2
输出: 8
解释: 能够达到的最大利润:
在此处买入 prices[0] = 1
在此处卖出 prices[3] = 8
在此处买入 prices[4] = 4
在此处卖出 prices[5] = 9
总利润: ((8 - 1) - 2) + ((9 - 4) - 2) = 8.
 */
/**
 * @param {number[]} prices
 * @param {number} fee
 * @return {number}
 */
var maxProfit = function(prices, fee) {
  /*
  动态规划：定义状态转移方程：
  不持有：dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] + prices[i] - fee)
  对于今天不持有，可以从两个状态转移过来：1. 昨天也不持有；2. 昨天持有，今天卖出。两者取较大值。
  持有：dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] - prices[i])
  对于今天持有，可以从两个状态转移过来：1. 昨天也持有；2. 昨天不持有，今天买入。两者取较大值。
   */
  const dp = []; //每天的最大利润
  const n = prices.length;
  for (let i = 0; i < n; i++) {
    dp.push([]);
  }
  //初始值
  dp[0][0] = 0; //第一天不持有
  dp[0][1] = -prices[0]; //第一天持有
  for (let i = 1; i < n; i++) {
    //状态转移方程
    //今天不持有
    dp[i][0] = Math.max(dp[i - 1][0], prices[i] + dp[i - 1][1] - fee);
    //今天持有
    dp[i][1] = Math.max(dp[i - 1][0] - prices[i], dp[i - 1][1]);
  }
  return dp[n - 1][0];
};

var maxProfit2 = function(prices, fee) {
  /*
  优化：dp[i]只会从 dp[i-1]转移得来，因此只用记住上一天的持有和不持有的最大利润即可
   */
  const dp = []; //每天的最大利润
  const n = prices.length;
  //初始值不持
  dp[0] = 0; //第一天不持有
  dp[1] = -prices[0]; //第一天持有
  for (let i = 1; i < n; i++) {
    //状态转移方程
    const temp = dp[0];
    dp[0] = Math.max(dp[0], dp[1] + prices[i] - fee);
    dp[1] = Math.max(temp - prices[i], dp[1]);
  }
  return dp[0];
};

const prices = [1, 3, 2, 8, 4, 9],
  fee = 2;
console.log(maxProfit2(prices, fee));

```
