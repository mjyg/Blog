/*
Trie（发音类似 "try"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。
这一数据结构有相当多的应用情景，例如自动补完和拼写检查。
请你实现 Trie 类：
Trie() 初始化前缀树对象。
void insert(String word) 向前缀树中插入字符串 word 。
boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。
*/
/*
输入
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
输出
[null, null, true, false, true, null, true]

解释
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // 返回 True
trie.search("app");     // 返回 False
trie.startsWith("app"); // 返回 True
trie.insert("app");
trie.search("app");     // 返回 True
 */

var Trie = function () {
  this.root = {};
};

Trie.prototype.insert = function (word) {
  let node = this.root;
  for (const ch of word) {
    if (!node[ch]) node[ch] = {};
    node = node[ch];
  }
  node.end = true;  //添加单词结束标记
};

Trie.prototype.searchPrefix = function (word) {
  let node = this.root;
  for (const ch of word) {
    if (!node[ch]) return false;
    node = node[ch];
  }
  return node
}

Trie.prototype.search = function (word) {
  return !!this.searchPrefix(word).end;
};

Trie.prototype.startsWith = function (prefix) {
  return !!this.searchPrefix(prefix);
};

const trie = new Trie();
trie.insert('apple');
console.log(trie.search('apple')); // 返回 True
console.log(trie.search('app')); // 返回 False
console.log(trie.startsWith('app')); // 返回 True
trie.insert('app');
console.log(trie.search('app')); // 返回 True
