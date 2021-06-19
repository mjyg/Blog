```js
/*
给出一个无重叠的 ，按照区间起始端点排序的区间列表。
在列表中插入一个新的区间，你需要确保列表中的区间仍然有序且不重叠（如果有必要的话，可以合并区间）。
示例 1：
输入：intervals = [[1,3],[6,9]], newInterval = [2,5]
输出：[[1,5],[6,9]]
示例 2：
输入：intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
输出：[[1,2],[3,10],[12,16]]
解释：这是因为新的区间 [4,8] 与 [3,5],[6,7],[8,10] 重叠。
 */

//先找出重叠区间，再合并区间
/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
var insert = function(intervals, newInterval) {
  let start = newInterval[0];
  let end = newInterval[1];
  const re = [];
  let i = 0;
  let placed = false;
  while( i < intervals.length) {
   const arr = intervals[i];
   if(arr[1]< start) {    //在插入区间的右侧且无交集
     re.push(arr)
   } else if(arr[0] > end) {    //在插入区间的左侧且无交集
     if(!placed) {  //插入新的区间
       re.push([start, end]);
       placed = true  //标志已经被插入
     }
     re.push(arr)
   } else {  //有交集，取并集
     start = Math.min(start, arr[0]);
     end = Math.max(end, arr[1]);
   }
   i++;
  }

  //没被插入过，需要插在最后
  if(!placed) {
    re.push([start, end]);
  }
  return re;
};

console.log('1111111111', insert([[1,4],[6,9]],[13,15]))

```
