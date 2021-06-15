```js
/**
 * 链表两两交换
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function(head) {
  if (!head || !head.next) return head;
  let curNode = head;
  head = head.next;
  let preNode = new ListNode(null); //这里必须要初始化一个额外的节点
  let nextKeep;
  while (curNode && curNode.next) {
    //记住下一组节点
    nextKeep = curNode.next.next;

    //移动指针
    curNode.next.next = curNode;
    preNode.next = curNode.next;
    curNode.next = nextKeep;

    //初始化下一次位置
    preNode = curNode;
    curNode = nextKeep;
  }
  return head;
};

var swapPairs2 = function(head) {
  if (!head || !head.next) return head;
  let curNode = head;
  head = head.next;
  let preNode = null; //不初始化一个额外的节点
  let nextKeep;
  while (curNode && curNode.next) {
    //记住下一组节点
    nextKeep = curNode.next.next;

    //移动指针
    curNode.next.next = curNode;
    if (preNode) {
      preNode.next = curNode.next;
    }
    curNode.next = nextKeep;

    //初始化下一次位置
    preNode = curNode;
    curNode = nextKeep;
  }
  return head;
};

```
