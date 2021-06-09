# 跨域

**目录**
> * [同源策略](#同源策略)
> * [跨域实现方式](#跨域实现方式)
>   * [JSONP](#JSONP)
>   * [跨域资源共享](#跨域资源共享)
>   * [postMessage](#postMessage)
>   * [websocket](#websocket)
>   * [nginx反向代理](#nginx反向代理)


不同域之间相互请求资源，就算作“跨域”<br>
当协议、子域名、主域名、端口号中任意一个不相同时，都算作不同域<br>
![](./image/1622680943(1).png)<br>
跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了

## 同源策略
同源策略是指在Web浏览器中，两个网页同源（有相同的协议、域名和端口）才允许资源交互。<br>
因为Web应用程序广泛依赖于HTTP cookie来维持用户会话，所以必须将不相关网站严格分隔，以防止丢失数据泄露。<br>

同源策略限制内容有：
* Cookie、LocalStorage、IndexedDB 等存储性内容<br>
* DOM 节点<br>
* 后端请求（跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了）<br>

同源策略仅适用于脚本，对于html的一些标签不适用，以下三个标签是允许跨域加载资源：
* <img src=XXX>
* <link href=XXX>
* <script src=XXX>

## 跨域实现方式
### JSONP
允许用户传递一个callback参数给服务端，然后服务端返回数据时会将这个callback参数作为函数名来包裹住JSON
数据，这样客户端就可以随意定制自己的函数来自动处理返回数据了。

例子：
本地服务器的index.html想要获取不同源的服务器上的数据，index.html里写如下js；
```js
// 得到航班信息查询结果后的回调函数
var getRemoteData = function(data){
    alert('获取到远程数据：',data);
};
// 提供jsonp服务的url地址（不管是什么类型的地址，最终生成的返回值都是一段javascript代码）
var url = "http://remoteserver.com/remote?code=CA1998&callback=getRemoteData";
// 创建script标签，设置其属性
var script = document.createElement('script');
script.setAttribute('src', url);
// 把script标签加入head，此时调用开始
document.getElementsByTagName('head')[0].appendChild(script); 
```
远程调用收到请求后，取出callback参数，获取方法名，会返回一段js代码：
```
getRemoteData({"result":"我是远程js带来的数据"});
```
本地页面就会弹出获取到远程数据的对话框。

>JSONP优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。<br>
>缺点是仅支持get方法具有局限性,不安全可能会遭受XSS攻击

### 跨域资源共享
跨域资源共享CORS的全称是Cross-Origin Resource Sharing。<br>

CORS 需要浏览器和后端同时支持。<br>

浏览器会自动进行 CORS 通信,发送请求时，如果浏览器发现违反了同源策略就会自动加上一个请求头 origin；<br>
后端在接受到请求后确定响应后会在 Response Headers 中加入一个属性 Access-Control-Allow-Origin,该
属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源<br>

>缺点：忽略 cookie，浏览器版本有一定要求

### postMessage
postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

可用于解决以下方面的问题:
* 页面和其打开的新窗口的数据传递
* 多窗口之间消息传递
* 页面与嵌套的iframe消息传递
* 上面三个场景的跨域数据传递

接下来看个例子： http://localhost:3000/a.html页面向http://localhost:4000/b.html传递“你好，我是a页面”,
然后后者传回"很高兴认识你，我是b页面"。
```
// a.html
  <iframe src="http://localhost:4000/b.html" frameborder="0" id="frame" onload="load()"></iframe> //等它加载完触发一个事件
  //内嵌在http://localhost:3000/a.html
    <script>
      function load() {
        let frame = document.getElementById('frame')
        frame.contentWindow.postMessage('你好，我是a页面', 'http://localhost:4000') //发送数据
        window.onmessage = function(e) { //接受返回数据
          console.log(e.data) // 很高兴认识你，我是b页面
        }
      }
    </script>
```
```
// b.html
  window.onmessage = function(e) {
    console.log(e.data) //你好，我是a页面
    e.source.postMessage(' 很高兴认识你，我是b页面', e.origin)
 }
```

### websocket
WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或
接收数据<br>
下面使用Socket.io来作为例子，它很好地封装了webSocket接口，本地文件socket.html向localhost:3000发生
数据和接受数据<br>
 ```
// socket.html
<script>
    let socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function () {
      socket.send('你好，我是客户端');//向服务器发送数据
    }
    socket.onmessage = function (e) {
      console.log(e.data);//接收服务器返回的数据
    }
</script>
```
```
// server.js
let express = require('express');
let app = express();
let WebSocket = require('ws');
let wss = new WebSocket.Server({port:3000});
wss.on('connection',function(ws) {
  ws.on('message', function (data) {  //接收客户端返回的数据
    console.log(data);  // 你好，我是客户端
    ws.send('你好，我是服务器')
  });
})
```

### nginx反向代理
使用nginx反向代理实现跨域，是最简单的跨域方式。只需要修改nginx的配置即可解决跨域问题，支持所有浏览器，
支持session，不需要修改任何代码，并且不会影响服务器性能。<br>
通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，
并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。<br>
先下载nginx，然后将nginx目录下的nginx.conf修改如下:
```
// proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```
把项目放入nginx的html目录下，通过命令行`nginx -s reload`启动nginx

🌺 参考文章：
>* [九种跨域方式实现原理（完整版）](https://juejin.cn/post/6844903767226351623#heading-17)
