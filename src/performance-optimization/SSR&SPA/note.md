spa性能问题：
html->vue.min.js->...->main.js->ajax/fetch->api->虚拟dom->dom diff->页面->事件体系

优点：点击切换其他页面的时候，加载最小组件


map性能问题：
缺点：html太大，后端渲染压力大 swig 
     一加载就是整个页面
解决办法：bigpipe 
优点：可见即可操作

实现功能：刷新：走map   切页：zou/spa   =》next,js和nust.js框架原理  同构