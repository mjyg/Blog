/*
假设有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花不能种植在相邻的地块上，它们会争夺水
源，两者都会死去。
给你一个整数数组  flowerbed 表示花坛，由若干 0 和 1 组成，其中 0 表示没种植花，1 表示种植了花。另有
一个数 n ，能否在不打破种植规则的情况下种入 n 朵花？能则返回 true ，不能则返回 false。
 */
/*
示例 1：
输入：flowerbed = [1,0,0,0,1], n = 1
输出：true

示例 2：
输入：flowerbed = [1,0,0,0,1], n = 2
输出：false
 */

// 思路：只要有三个0出现，就往中间插入一个1，最后比较插入1的数量和n的大小即可
// 注意非法的边界-1和length下标可以视作0
var canPlaceFlowers = function (flowerbed, n) {
  let i = 0;
  let num = 0;
  while (i < flowerbed.length) {
    if (!flowerbed[i - 1] && !flowerbed[i] && !flowerbed[i + 1]) {
      flowerbed[i] = 1;
      num++;
    }
    i++;
  }
  return num >= n;
};

console.log(canPlaceFlowers([1, 0, 0], 1));
