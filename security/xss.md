# 跨站脚本攻击(XSS)

XSS (Cross Site Script) 跨站脚本攻击指的是通过利用网页开发时留下的漏洞，通过巧妙的方法注入恶意指令
代码到网页，使用户加载并执行攻击者恶意制造的网页程序。这些恶意网页程序通常是JavaScript，但实际上也
可以包括Java，VBScript，ActiveX，Flash或者甚至是普通的HTML。攻击成功后，攻击者可能得到更高的权限
（如执行一些操作）、私密网页内容、会话和cookie等各种内容,如非法投票等。

XSS 主要是通过输入框等形式提交 js 脚本，最终在页面上被执行。

## 防御措施

### CSP
CSP 的实质就是白名单制度，开发者明确告诉客户端，哪些外部资源可以加载和执行，等同于提供白名单。它的实
现和执行全部由浏览器完成，开发者只需提供配置。

CSP 大大增强了网页的安全性。攻击者即使发现了漏洞，也没法注入脚本，除非还控制了一台列入了白名单的可
信主机。

两种方法可以启用 CSP：<br>
一种是通过 HTTP 头信息的Content-Security-Policy的字段。
```
Content-Security-Policy: script-src 'self'; object-src 'none';
style-src cdn.example.org third-party.org; child-src https:
```
另一种是通过网页的<meta>标签:.
```
<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">
```

### 输入检查
不要相信用户的任何输入。  对于用户的任何输入要进行检查、过滤和转义。建立可信任的字符和 HTML 标签白名
单，对于不在白名单之列的字符或者标签进行过滤或编码。

在 XSS 防御中，输入检查一般是检查用户输入的数据中是否包含 <，> 等特殊字符，如果存在，则对特殊字符进
行过滤或编码，这种方式也称为 XSS Filter。

🌺 参考文章：
>* [Content Security Policy 入门教程](http://www.ruanyifeng.com/blog/2016/09/csp.html)
>* [web安全：什么是 XSS 和 CSRF](https://juejin.cn/post/6844903856443392014)
