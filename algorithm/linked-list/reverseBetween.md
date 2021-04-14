# 反转链表II
题目：给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。
<br>
例子<br>
输入：head = [1,2,3,4,5], left = 2, right = 4<br>
输出：[1,4,3,2,5]
```js
/**
 * Definition for singly-linked list.
 */
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
  if(left === right) return head

  // 因为头结点可能会发生改变，虚拟一个头结点使用
  const dummyNode = new ListNode(-1, head)
  let cur = dummyNode;
  let i = 0;

  // 移动指针到逆置的开始节点
  while(i < left - 1) {
    cur = cur.next;
    i++;
  }
  const pre = cur; //标记逆置节点的前一个节点，用来连接逆置后的节点
  cur = cur.next
  i++;
  let start = cur; //标志逆置节点的头节点
  let end = cur; // 标志逆置后节点的最后结点
  cur = end.next;

  // 把需要逆置的节点摘下来拼在start的前面
  while(i < right) {
    const temp = cur.next;
    cur.next = start;
    start = cur;
    cur = temp;
    i++;
  }

  // 链接逆置节点和原节点
  pre.next = start;
  end.next = cur;
  return dummyNode.next;
};

// 解法二：直接逆置
var reverseBetween2 = function(head, left, right) {
  const dummy_node = new ListNode(-1, head);
  let i = 0;
  let cur = dummy_node
  while(i < left - 1) {
    cur = cur.next;
    i++;
  }
  const pre = cur;  //pre记住开始逆置节点的前一个节点，保持不变
  cur = cur.next;
  i++
  while(i < right) {
    const next = cur.next;
    cur.next = next.next;
    next.next = pre.next;
    pre.next = next;
    i++;
  }
  return dummy_node.next;
};


const head = {
  val:1,
  next:{
    val:2,
    next:{
      val:3,
      next:{
        val:4,
        next:{
          val:5,
          next:null
        }
      }
    }
  }
}

console.log(reverseBetween2(head, 2,4))
```
以上两种解法时间复杂度为O(n),空间复杂度为O(1)<br>
链表的算法注意以下两点：
* 如果头结点有可能会发生变动，最好使用虚拟头结点来代替原来的头节点
* 在循环链表的过程中注意每次循环指针位置的一致性
