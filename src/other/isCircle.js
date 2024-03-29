/*
输入：
一组服务依赖关系list，('A', 'B') 表示 A 会调用 B 服务
service_relations = [('A', 'B'), ('A', 'C'), ('B', 'D'), ('D', 'A')]
输出：
由于存在 A - B - D - A 故存在循环依赖，返回True；反之如果不存在，返回False
 */

// 转成有向图
function handleData(relation) {
  const obj = {};
  for (const item of relation) {
    const [key1, key2] = item;
    if (!obj[key1]) obj[key1] = { from: [], to: [] };
    if (!obj[key2]) obj[key2] = { from: [], to: [] };
    obj[key1].to.push(key2);
    obj[key2].from.push(key1);
  }
  return obj;
}

//用拓扑排序检测有向图是否有环
function isCircle(relation) {
  const nodes = handleData(relation);
  while (Object.keys(nodes).length) {
    for (const key of Object.keys(nodes)) {
      const { from, to } = nodes[key];
      // 处理入度为0的点
      if (!from.length) {
        // 然后遍历该点的出度，把出度对应的点的入度删掉
        for (const item of to) {
          nodes[item].from = nodes[item].from.filter((val) => val !== key);
        }
        delete nodes[key];
      } else {
        return true; //遍历一遍没有入度为0的点，说明存在环
      }
    }
  }
  return false;
}

// 一次遍历法
function isCircle2(relation) {
  const map = new Map();
  for (const item of relation) {
    const [from, to] = item;

    //为每一个依赖开始的节点存储他的所有依赖项
    if (!map.has(from)) map.set(from, []);
    map.get(from).push(to);

    // 若to是开始节点，则把from存入to依赖项中
    if (map.has(to)) map.get(to).push(from);

    // 若to是开始节点，且to的依赖中有from,则存在环
    if (map.get(to) && map.get(to).indexOf(from) !== -1) return true;
  }
  return false;
}

const service_relations = [
  ["A", "B"],
  ["A", "C"],
  ["B", "D"],
  ["D", "A"],
];
console.log(isCircle2(service_relations));
