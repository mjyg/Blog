/*
设计一个支持在平均 时间复杂度 O(1) 下，执行以下操作的数据结构。

insert(val) ：当元素 val 不存在时，向集合中插入该项。
remove(val) ：元素 val 存在时，从集合中移除该项。
getRandom ：随机返回现有集合中的一项。每个元素应该有 相同的概率 被返回。
示例 :

// 初始化一个空的集合。
RandomizedSet randomSet = new RandomizedSet();

// 向集合中插入 1 。返回 true 表示 1 被成功地插入。
randomSet.insert(1);

// 返回 false ，表示集合中不存在 2 。
randomSet.remove(2);

// 向集合中插入 2 。返回 true 。集合现在包含 [1,2] 。
randomSet.insert(2);

// getRandom 应随机返回 1 或 2 。
randomSet.getRandom();

// 从集合中移除 1 ，返回 true 。集合现在包含 [2] 。
randomSet.remove(1);

// 2 已在集合中，所以返回 false 。
randomSet.insert(2);

// 由于 2 是集合中唯一的数字，getRandom 总是返回 2 。
randomSet.getRandom();
 */

function RandomizedSet() {
  this.map = new Map() //哈希表存储存储值到数组下标的映射。
  this.arr = []  //动态数组存储元素值
}

RandomizedSet.prototype.insert = function(key) {
  if(this.map .has(key)) return false
  this.map.set(key, this.arr.length)  //值为对应key在数组中的下标
  this.arr.push(key)  // 和map互相映射
  return true
}

RandomizedSet.prototype.remove = function(key) {
  if(!this.map.has(key)) return false

  // 数组中将要删除元素和最后一个元素交换
  const removeIndex = this.map.get(key)
  const lastKey = this.arr[this.arr.length -1]
  this.map.set(lastKey, removeIndex)  // map里把数组中最后一个元素的value改为removeIndex
  this.arr[removeIndex] = lastKey  //把数组要删除的元素和最后一个交换

  this.map.delete(key)
  this.arr.pop()
  return true
}

RandomizedSet.prototype.getRandom = function() {
  const randomIndex = Math.floor(Math.random() * this.arr.length);
  return this.arr[randomIndex]
}

//时间复杂度为O(1),空间复杂度为O(n)
