// 判断一个有向图是否有环

// 图用以下结构表示：
const node1 = {
  value: 1,
};
const node2 = {
  value: 2,
};
const node3 = {
  value: 3,
};
const node4 = {
  value: 4,
};
node1.from = [];
node1.to = [node2];
node2.from = [node1, node4];
node2.to = [node3];
node3.from = [node2];
node3.to = [node4];
node4.from = [node3];
node4.to = [node2];

const nodes = { node1, node2, node3, node4 };

//使用拓扑排序：先删掉入度为0的点，然后遍历该点的出度，把出度对应的点的入度删掉，继续循环，如果最后还存在
//未被删除的点，则说明存在环
function isCircle(nodes) {
  while (Object.keys(nodes).length) {
    for (const key of Object.keys(nodes)) {
      const { from, to } = nodes[key];
      // 处理入度为0的点
      if (!from.length) {
        // 然后遍历该点的出度，把出度对应的点的入度删掉
        for (const item of to) {
          item.from = item.from.filter((val) => val !== nodes[key]);
        }
        delete nodes[key];
      } else {
        return true; //遍历一遍没有入度为0的点，说明存在环
      }
    }
  }
  return false;
}

console.log(isCircle(nodes));
