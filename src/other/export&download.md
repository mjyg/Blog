# 二进制文件流下载和打印
二进制文件流下载和打印需要以下几步操作：<br>
* 首先，把二进制文件流转为Blob。Blob 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进
制的格式进行读取，也可以转换成 ReadableStream 来用于数据操作。 
* 调用URL的createObjectURL方法返回一个URL对象，URL对象里的URL可用于指定源 object的内容
* 如果是下载操作需要构造一个隐藏的iframe(调用iframe的contentWindow的print方法实现打印),如果是打印操
作需要构造一个隐藏的a标签，让他们的链接指向上面的URL即可
* 最后，当不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法来释放。浏览器在 
document 卸载的时候，会自动释放它们，但是为了获得最佳性能和内存使用状况，你应该在安全的时机主动释放掉它们。

下面是代码：<br>
下载操作：
```js
 let content = response.data;
// 把二进制文件流转为类文件对象Blob，在这里要加上{ type: 'application/pdf' }转换
const blob = new Blob([content], { type: 'application/pdf' });
let date = new Date().getTime();
let ifr = document.createElement('iframe');
ifr.style.frameborder = 'no';
ifr.style.display = 'none';
ifr.style.pageBreakBefore = 'always';
ifr.setAttribute('id', 'printPdf' + date);
ifr.setAttribute('name', 'printPdf' + date);

//createObjectURL返回一个URL对象，包含了一个对象URL，该URL可用于指定源 object的内容
ifr.src = window.URL.createObjectURL(blob);
document.body.appendChild(ifr);
let printWin = document.getElementById('printPdf' + date).contentWindow;
setTimeout(() => {
  printWin.print();
}, 100);

// 当不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法来释放。
window.URL.revokeObjectURL(ifr.src);
```
打印操作：
```js
const contentType = response.headers['content-type'];
const blob = new Blob([response.data], { type: contentType });

//获取文件名
const contentDisposition = response.headers['content-disposition'];
let fileType = '';
if (contentDisposition) {
  const arr = contentDisposition.split('filename=')[1].split('.');
  fileType = arr[arr.length - 1];
  fileType = fileType.slice(0, fileType.length - 1);
}
const fileName = otherOption.fileName + '.' + fileType;

// 非IE下载
if ('download' in document.createElement('a')) {
  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob); // 创建下载的链接
  link.download = fileName; // 下载后文件名
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click(); // 点击下载
  window.URL.revokeObjectURL(link.href); // 释放掉blob对象
  document.body.removeChild(link); // 下载完成移除元素
} else {
  // IE10+下载
  window.navigator.msSaveBlob(blob, fileName);
}
```
