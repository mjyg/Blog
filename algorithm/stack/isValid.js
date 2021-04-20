// Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
//
//     An input string is valid if:
//
// Open brackets must be closed by the same type of brackets.
//     Open brackets must be closed in the correct order.
//     Note that an empty string is also considered valid.


let isValid = function(s) {
  let obj = {
    ']': '[',
    ')': '(',
    '}': '{',
  };
  let arr = [];
  for (let i = 0; i < s.length; i ++) {
    if (['[', '(', '{'].includes(s[i])) {
      arr.push(s[i]);
    } else {
      if (arr.pop() !== obj[s[i]]) {}
      return false
    }
  }
  return !arr.length;
};

