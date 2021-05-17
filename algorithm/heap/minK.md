题目：
```
输入整数数组 arr ，找出其中最小的 k 个数。例如，输入4、5、1、6、2、7、3、8这8个数字，则最小的4个数字是1、2、3、4。
 示例 1：
输入：arr = [3,2,1], k = 2
输出：[1,2] 或者 [2,1]
示例 2：
输入：arr = [0,1,2,1], k = 1
输出：[0]
限制：
0 <= k <= arr.length <= 10000
0 <= arr[i] <= 10000
```
思路：
* 从数组中取前k个数，构造最大堆(从上往下，每个元素和父元素比较，大于父元素则交换)
* 遍历后面的元素，如果大于堆顶元素，则不处理（因为比下面所有元素都大，不可能是最小的前k个数）；
* 如果小于堆顶元素，则替换掉堆顶元素，再堆化成最大堆
* 遍历结束后，堆中的数据就是前k个最小的数

代码：
```js
function minK(arr, k) {
  arr.unshift(null)  //为了使i/2有效，第一个元素从1开始
  for(let i = 1; i <= arr.length; i ++) {
    if(i <= k) {
      // 构造大顶堆
      buildHeap(arr, i)
    } else if(arr[i] < arr[1]){
      arr[1] = arr[i]
      // 堆化
      for(let j =1; j <= k; j++ ) {
        buildHeap(arr, j)
      }
    }
  }
  return arr.slice(1, k+1)
}

function buildHeap(arr,i) {
  while(Math.floor(i/2) > 0 && arr[Math.floor(i/2)] < arr[i]) {
    swap(arr, Math.floor(i/2), i)
    i = Math.floor(i/2)
  }
}

function swap(arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}


console.log(minK([4,5,1,6,2,7,3,8,4], 4))  //[ 4, 3, 1, 2 ]

```
时间复杂度为O(nlogk)，空间复杂度为(O(k))

>利用堆求TopK问题相比于使用排序的优势：<br>
>当我们需要在动态数组中求TopK问题时，动态数组插入或删除元素后，每次都需要对整个数组进行排序,时间复杂度为O(nlogn)<br>
>而使用堆，就可以只维护一个K大小的堆，如此例，添加时只需要把该元素与堆顶的元素比较，如果比堆顶元素大，则不处理，
>反之，只需要替换掉堆顶元素，再堆化，时间复杂度为O(logk)
