/*
最小栈
设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
push(x) —— 将元素 x 推入栈中。
pop() —— 删除栈顶的元素。
top() —— 获取栈顶元素。
getMin() —— 检索栈中的最小元素。
 */
/*
示例:
输入：
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]
输出：
[null,null,null,null,-3,null,0,-2]
解释：
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.getMin();   --> 返回 -2.
提示：
pop、top 和 getMin 操作总是在 非空栈 上调用
 */
/**
 * initialize your data structure here.
 */
const MinStack = function() {
  this.arr = [];
  this.helper = []; //单调递减的辅助栈,栈顶元素永远是arr中最小的元素
};

/**
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {
  this.arr.push(val);
  if (this.helper.length === 0) {
    this.helper.push(val);
  } else {
    const helperTop = this.helper[this.helper.length - 1];
    // 如果辅助栈的栈顶元素大于入栈元素，则把栈顶元素入栈；否则把辅助栈的栈顶元素再一次入栈
    if (helperTop > val) {
      this.helper.push(val);
    } else {
      this.helper.push(helperTop);
    }
  }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
  this.arr.pop();
  this.helper.pop();
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
  return this.arr[this.arr.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
  return this.helper[this.helper.length - 1];
};

const obj = new MinStack();
obj.push(2);  // arr:2       helper:2
obj.push(1);  // arr:2,1     helper:2,1
obj.push(3);  // arr:2,1,3   helper:2,1,1
obj.pop();    // arr:2,1     helper:2,1
const param_1 = obj.top();
const param_2 = obj.getMin();
console.log(param_1, param_2); // 1 1

// 该算法时间复杂度为O(1)，空间复杂度为O(n)


//解法2：用一个栈保存元素和最小值的差值，用一个min来保存当前的最小值
function MinStack2() {
  this.min = 0;
  this.stack = [];
}

MinStack2.prototype.push = function(val) {
  if(this.stack.length === 0) {
    this.min = val;
    this.stack.push(0);
  } else {
    const num = val - this.min;
    if(num < 0) {
      this.min = val;  // 当前值比最小值小，更新最小值
    }
    this.stack.push(num); //差值入栈
  }
};

MinStack2.prototype.pop = function() {
  const num = this.stack.pop();
  if(this.min <0) {
    // 当最小值为负数时，说明入栈的元素更小，要更新最小值为最小值-当前值
    this.min = this.min - num;
  }
};

MinStack2.prototype.top = function() {
  const num = this.stack[this.stack.length - 1];
  // 当num为负数时，说明刚刚更新过最小值，num就是top值，直接返回num;否则，top为num和最小值的和
  if( num < 0) {
    return num;
  }
  return num + this.min;
};

MinStack2.prototype.getMin = function(){
  return this.min;
};
//该算法时间复杂度和空间复杂度均为O(1)

const obj2 = new MinStack2();
obj2.push(2);  // stack:0             min:2
obj2.push(1);  // stack:0 -1          min:1
obj2.push(3);  // stack 0 -1 2        min:1
obj2.push(0);  // stack 0 -1 2 -1     min:0
obj2.push(-2); // stack 0 -1 2 -1 -2  min:-2
obj2.push(-1); // stack 0 -1 2 -1 1   min:-2
obj2.push(-3); // stack 0 -1 2 -1 -1  min:-3
obj2.pop();    //
const param_3 = obj2.top();
const param_4 = obj2.getMin();
console.log(param_3, param_4);
