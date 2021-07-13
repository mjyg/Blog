// 手写一个方法实现请求失败后一定时间重试，重试时间是上次的两倍
function request(callback, retry = 5, delay = 50) {
  if (typeof callback !== 'function') {
    callback = () => {
      throw 'error';
    };
  }

  let _retry = 0,
    _delay = delay / 2;
  const fetch = async (callback) => {
    try {
      await callback();
    } catch (e) {
      _retry++;
      _delay *= 2;
      if (_retry > retry) {
        console.log('请求超时');
      } else {
        console.log(`第${_retry}次重试，重试时间是${_delay}ms`);
        setTimeout(() => {
          fetch();
        }, _delay);
      }
    }
  };
  return fetch(callback);
}

request('qqq');

/*
第1次重试，重试时间是50ms
第2次重试，重试时间是100ms
第3次重试，重试时间是200ms
第4次重试，重试时间是400ms
第5次重试，重试时间是800ms
请求超时
 */
