```js
/*
假设有打乱顺序的一群人站成一个队列。 每个人由一个整数对(h, k)表示，其中h是这个人的身高，k是排在这个人
前面且身高大于或等于h的人数。 编写一个算法来重建这个队列。
注意：
总人数少于1100人。
示例
输入:
[[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]]
输出:
[[5,0], [7,0], [5,2], [6,1], [4,4], [7,1]]
 */

/*
思想：先按h升序，再按k降序，当前这个人就是剩下未安排人中最矮的，他的k值即为当前剩余空位的索引,表示他前面
有多少人高度不比他小
 */
/**
 * @param {number[][]} people
 * @return {number[][]}
 */
var reconstructQueue = function(people) {
  //冒泡排序
  for (let i = 0; i < people.length; i++) {
    for (let j = 0; j < people.length - 1 - i; j++) {
      if (people[j][0] > people[j + 1][0]) {
        //h升序
        swap(people, j, j + 1);
      } else if (people[j][0] === people[j + 1][0] && people[j][1] < people[j + 1][1]) {
        //k降序
        swap(people, j, j + 1);
      }
    }
  }
  //再遍历一遍，按K值放置
  const re = [];
  for (let i = 0; i < people.length; i++) {
    let index = 0;
    for (let j = 0; j < people.length; j++) {
      if (index === people[i][1] && !re[j]) {
        re[j] = people[i];
        break;
      }
      if (index < people[i][1] && !re[j]) {
        index++;
      }
    }
  }
  return re;
};

function swap(people, i, j) {
  const temp = people[i];
  people[i] = people[j];
  people[j] = temp;
}

console.log(reconstructQueue([[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]]));

```
