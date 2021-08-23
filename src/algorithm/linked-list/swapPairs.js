/*
两两交换链表： 1 -> 2 -> 3 -> 4 -> 5 -> null    2 -> 1 -> 4 -> 3 -> 5 -> null
 */

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function swapPairs(head) {
  const newHead = new ListNode(0, head);
  let pre = newHead;
  let cur = pre.next;
  while(cur && cur.next) {
    const next = cur.next;
    pre.next = next;
    cur.next = next.next;
    next.next = cur;
    pre = cur;
    cur = cur.next;
  }
  return newHead.next;
}

const head = {
  value: 1,
};

console.log(swapPairs(head));
