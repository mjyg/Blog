/*
标题：输入电话号码时自动推荐出下一位合法的数字集
描述信息
公司有10万名员工，每名员工都有一个座机号码。现在要在网页上实现一个“自动补位推荐” 的功能，问如何实现？
解释：
“自动补位推荐” 功能：有一个输入框，用户每输入一个数字，立马推荐出下一位合法的数字集合。
比如只有 5789234、5623786、5633678三个电话号码，当第一位输入5时，立马推荐下一位有效数字集合[ 7, 6 ]，
如果第二位输入6时，下一位有效数字集合为[2，3]....
 */

function suggestPhone(num, phone) {
  if (!phone.length || num.length >= phone[0].length) return [];

  const re = [];
  for (const item of phone) {
    if (item.substring(0, num.length) === num) {
      re.push(item[num.length]);
    }
  }
  return re;
}

const phone = ['5789234', '5623786', '5633678'];

console.log(suggestPhone('5', phone)); // [ '7', '6', '6' ]
console.log(suggestPhone('56', phone)); // [ '2', '3' ]
console.log(suggestPhone('563', phone)); // [ '3' ]
console.log(suggestPhone('5633678', phone)); // []

