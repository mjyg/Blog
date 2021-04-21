```js
/*
题目：给定一个链表，判断链表中是否有环。如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。
如果链表中存在环，则返回 true 。 否则，返回 false 。
进阶：你能用 O(1)（即，常量）内存解决此问题吗？
例子：
输入：head = [3,2,0,-4], pos = 1
输出：true<br>
解释：链表中有一个环，其尾部连接到第二个节点。

 */
/**
 * Definition for singly-linked list.
 */
function ListNode(val) {
  this.val = val;
  this.next = null;
}
/**
 * @param {ListNode} head
 * @return Boolean
 */
var detectCycle = function (head) {
  // 快指针和慢指针遍历链表，如果两个指针相遇则有环，如果快指针到终点则没有环
  let fast = head;
  let slow = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
    if(fast === slow) return true
  }
  return false
};

/*
环形链表II
题目：给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意，pos 仅仅是用于标识环的情况，并不会作为参数传递到函数中。
说明：不允许修改给定的链表
进阶：你能用 O(1)（即，常量）内存解决此问题吗？
例子：
输入：head = [3,2,0,-4], pos = 1<br>
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点。。
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var detectCycle2 = function (head) {
  // 在快慢指针相遇的地方，慢指针回到表头继续遍历，快指针也一个节点一个节点遍历，
  // 他们再次相遇的点为入环节点
  let fast = head;
  let slow = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
    if(fast === slow) {
      slow = head;
      while(slow !== fast) {
        slow = slow.next;
        fast = fast.next;
      }
      return slow;
    }
  }
  return null;
};

const a0={},a1={},a2={},a3={};
a0.val=3;a0.next=a1;
a1.val=2;a1.next=a2;
a2.val=0;a2.next=a3;
a3.val=-4;a3.next=a1;

console.log(detectCycle2(a0))
```
