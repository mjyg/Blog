const timeMiddleware = (store) => (next) => (action) => {
 console.log('⏰', new Date().getTime())
  next(action);
};

export default timeMiddleware