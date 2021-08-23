// 字符串解析，要求
// 相同key的多个值用数组封装
// 如果能用JSON解析则作为json对象
// 没有value，赋值false的boolean值
// base64编码的，需要转换成字符串
// input: name=adam&name=bob&obj={a:1,b:2}&use&encodeStr=%20
// output:
// {
//   name: ['adam', 'bob'],
//   obj: {a:1, b:2},
//   use: false,
//   encodeStr: ' '
// }

function analysisStr(str) {
  const list = str.split('&');
  const re = {};
  for (const item of list) {
    const [key, value] = item.split('=');
    //相同的key，转成数组
    if (re[key]) {
      if (re[key] instanceof Array) {
        re[key].push(value);
      } else {
        re[key] = [re[key], value];
      }
    } else if (!value) {
      //没有value，赋值false的boolean值
      re[key] = false;
    } else if (value[0] === '{' && value[value.length-1] === '}') {
      // 如果能用JSON解析则作为json对象
      const arr = value.substring(1, value.length - 1).split(',')
      const obj = {}
      for(const item of arr) {
        const [key,value] = item.split(':')
        obj[key] = value
      }
      re[key] = obj
    } else if (isBase64(value)) {
      // base64编码的，需要转换成字符串
      re[key] = decodeURI(value);
    } else {
      re[key] = value;
    }
  }
  return re;
}

function isJsonString(str) {
  try {
    return typeof JSON.parse(str) === 'object';
  } catch (e) {
    return false;
  }
}

function isBase64(str) {
  try {
    return encodeURI(decodeURI(str)) === str;
  } catch (e) {
    return false;
  }
}

console.log(analysisStr('name=adam&name=bob&obj={a:1,b:2}&use&encodeStr=%20'));
