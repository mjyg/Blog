```js
//查询URL中的参数
function url(url) {
  let args={};
  if (!url) {
    return args;
  }

  let qs = url.split('?');
  if (qs.length < 2) {
    return args;
  }

  let items = qs[1].split('&');
  items.map((item) => {
    let temp = item.split('=');
    let name = decodeURIComponent(temp[0]);
    let value = decodeURIComponent(temp[1]);
    if (name) {
      args[name] = value;
    }
  });

  return args;
}

console.log(url('https://cn.bing.com/search-18A41D8D0F95C74D8?a=1&ab=2'));

```
