var count = 1;
var container = document.getElementById("container");

function getUserAction(e) {
  console.log("e", e); //MouseEvent
  container.innerHTML = count++;
  return "ok";
}

const getUserActionDebounce = debounce(getUserAction, 5000, true);

container.onmousemove = getUserActionDebounce;

document.getElementById("button").onclick = getUserActionDebounce.cancel;

function debounce(func, wait, immediate) {
  let timeout, re;
  const debounced = function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    if (immediate) {
      //timeout为null，则表示停止触发了n秒后的第一次触发，可以立即执行一次
      if (!timeout) re = func.apply(context, args);
      timeout = setTimeout(function () {
        //单独控制timeout是否为null的定时器
        timeout = null; //当等待n秒后，可以再一次立即执行
      }, wait);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
    return re;
  };

  // 取消计时，立即执行一次
  debounced.cancel = function () {
    clearTimeout(timeout); //清除定时器
    timeout = null; //下次调用可以立即执行
  };

  return debounced;
}
