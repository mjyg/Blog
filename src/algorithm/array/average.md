```js
/*
给你一个整数数组 salary ，数组里每个数都是唯一 的，其中 salary[i] 是第 i 个员工的工资。
请你返回去掉最低工资和最高工资以后，剩下员工工资的平均值。
示例 1：
输入：salary = [4000,3000,1000,2000]
输出：2500.00000
解释：最低工资和最高工资分别是 1000 和 4000 。
去掉最低工资和最高工资以后的平均工资是 (2000+3000)/2= 2500
提示：
3 <= salary.length <= 100
10^3 <= salary[i] <= 10^6
salary[i] 是唯一的。
与真实值误差在 10^-5 以内的结果都将视为正确答案。
*/

//一趟遍历，得到最大值和最小值以及所有值的总和，最后返回总和减去最大值最小值再求得平均值
//时间复杂度O(N),空间复杂度O（1）
/**
 * @param {number[]} salary
 * @return {number}
 */
var average = function(salary) {
  let sum = salary[0];
  let min = salary[0];
  let max = salary[0];
  for (let i = 1; i < salary.length; i++) {
    sum += salary[i];
    if (salary[i] > max) max = salary[i];
    if (salary[i] < min) min = salary[i];
  }
  return (sum - max - min) / (salary.length - 2);
};

```
