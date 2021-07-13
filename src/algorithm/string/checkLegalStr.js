// 合法字符串判断 {([])}

function checkLegalStr(s) {
  const stack = [];
  for (const item of s) {
    if (["{", "(", "["].includes(item)) {
      stack.push(item);
    }
    if (
      (item === "}" && stack.pop() !== "{") ||
      (item === "]" && stack.pop() !== "[") ||
      (item === ")" && stack.pop() !== "(")
    ) {
      return false;
    }
  }
  return !stack.length;
}

console.log(checkLegalStr("()"));
