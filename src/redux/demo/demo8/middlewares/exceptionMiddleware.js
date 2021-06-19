const exceptionMiddleware = (store) => (next) => (action) => {
  try {
    next(action);
  } catch(e){
    console.log('错误报告',e)
  }
};

export default exceptionMiddleware