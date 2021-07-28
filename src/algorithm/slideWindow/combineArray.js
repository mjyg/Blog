/*
合并连续区间：[1,2,3,4,1,2,3,6,7,8] => ['1-4','1-3','6-8']
 */

// 使用滑动窗口
function combineArray(arr) {
  if (arr.length === 1) return arr;
  const re = [];
  let start = 0; //滑动窗口开始
  let end = 0; //滑动窗口结束
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] + 1 === arr[i]) {
      // 上个元素和当前元素连续
      end = i;
    } else {
      // 上个元素和当前元素不连续，比较start和end,判断应该存储的是单个元素还是合并区间
      if (start === end) {
        // 存储单个元素
        re.push(arr[start]);
      } else {
        // 存储合并区间
        re.push(arr[start] + '-' + arr[end]);
      }

      // 移动滑动窗口
      start = i;
      end = i;
    }
  }

  // 存储最后的元素或区间
  if (start === end) {
    re.push(arr[start]);
  } else {
    re.push(arr[start] + '-' + arr[end]);
  }

  return re;
}

console.log(combineArray([1, 2, 1, 1, 2, 4, 6, 7, 8,10]));
