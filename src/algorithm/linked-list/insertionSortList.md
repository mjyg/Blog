```js
/*
对链表进行插入排序。
插入排序的动画演示如上。从第一个元素开始，该链表可以被认为已经部分排序（用黑色表示）。
每次迭代时，从输入数据中移除一个元素（用红色表示），并原地将其插入到已排好序的链表中。
插入排序算法：
插入排序是迭代的，每次只移动一个元素，直到所有元素可以形成一个有序的输出列表。
每次迭代中，插入排序只从输入数据中移除一个待排序的元素，找到它在序列中适当的位置，并将其插入。
重复直到所有输入数据插入完为止。
示例 1：
输入: 4->2->1->3
输出: 1->2->3->4
 */
/**
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
function ListNode(val) {
  this.val = val;
  this.next = null;
}

//依次从老链表中取出头结点，插入新链表中，插入时保证新链表有序
var insertionSortList = function (head) {
  if (!head) return head;
  let newHead = new ListNode(-1);
  newHead.next = head;
  head = head.next;
  let lastSorted = newHead.next;
  while (head) {
    if (lastSorted.val <= head.val) {
      //插在新链表最后
      lastSorted = lastSorted.next;
    } else {
      //遍历新链表，找出合适的位置插入i
      let pre = newHead;
      while (pre.next.val < head.val) {
        pre = pre.next;
      }
      lastSorted.next = head.next;
      head.next = pre.next;
      pre.next = head;
    }
    head = lastSorted.next;
  }
  return newHead.next;
};

const link = {
  val: 4,
  next: {
    val: 2,
    next: {
      val: 6,
      next: {
        val: 3,
        next: null,
      },
    },
  },
};

console.log(insertionSortList(link));

```
