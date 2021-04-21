```js
/*
请根据每日 气温 列表，重新生成一个列表。对应位置的输出为：要想观测到更高的气温，至少需要等待的天数。
如果气温在这之后都不会升高，请在该位置用 0 来代替。
例如，给定一个列表 temperatures = [73, 74, 75, 71, 69, 72, 76, 73]，你的输出应该是 [1, 1, 4, 2, 1, 1, 0, 0]。
提示：气温 列表长度的范围是 [1, 30000]。每个气温的值的均为华氏度，都是在 [30, 100] 范围内的整数
 */
const getTop = (stack) => stack[stack.length - 1];
/**
 * @param {number[]} T
 * @return {number[]}
 */
var dailyTemperatures = function (T) {
  // 单调栈：遍历T，若栈中无元素或元素比栈顶元素小，则把下标入栈；否则出栈，同时设定re中相应下标为
  // 栈顶元素和当前遍历元素下标的插值
  //时间复杂度为O(n),空间复杂度为O(n)
  const stack = [];
  const re = new Array(T.length).fill(0)  // re必须先初始化
  for (let i = 0; i < T.length; i++) {
    if (T[i] <= T[getTop(stack)] || !stack.length) {
      stack.push(i);
    } else {
      while (T[i] > T[getTop(stack)]) {
        const index = stack.pop();
        re[index] = i - index;
      }
      stack.push(i);
    }
  }
  return re;
};

console.log(dailyTemperatures([93,97,32,43,78]));

```
