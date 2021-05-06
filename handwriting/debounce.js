var count = 1;
var container = document.getElementById('container');

function getUserAction() {
  container.innerHTML = count++;
};

container.onmousemove = debounce(getUserAction,1000);


function debounce(func, wait) {
  var timeout;
  return function() {
    clearTimeout(timeout)  //频繁调用时清除定时器，重新计时
    timeout = setTimeout(func, wait)
  }
}
