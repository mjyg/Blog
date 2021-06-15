```js
/*已知如下数组：
var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组
*/

function flatArray(arr, re=[]) {
  for (const item of arr) {
    if (item instanceof Array) {
      flatArray(item, re);
    } else {
      //每次加入数组的时候排一下序并去除重复数据
      const len = re.length;
      if (len === 0) {
        re.push(item)
      } else {
        let i = 0;
        while(i < re.length && re[i] < item) {
          i ++;
        }
        if(re[i] !== item) {
          re.splice(i, 0, item);
        }
      }
    }
  }
  return re;
}

var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
console.log(flatArray(arr));
//[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]


//方法2
Array.prototype.flat = function() {
  const re = [].concat(...this.map((item => {
    if (Array.isArray(item)) {
      return item.flat()
    } else {
      return [item]
    }
  })));
  return re;
};

Array.prototype.unique = function() {
  return [...new Set(this)];
};

const sort = (a, b) => a - b;

console.log(arr.flat().unique().sort(sort));


//方法3：
Array.prototype.flat2 = function() {
  const re = this.toString().split(',');
  const arr = [];
  for (let item of re) {
    arr.push(+item)
  }
  return arr;
};

console.log(arr.flat2().unique().sort(sort));

```
