import compose from './compose.js';

const applyMiddleware = function (...middlewares) {
  return function (oldCreateStore) {
    return function (reducer, initState) {
      const store = oldCreateStore(reducer, initState);
      const simpleStore = { getState: store.getState };
      const chain = middlewares.map((middleware) => middleware(simpleStore));
      const dispatch = compose(...chain)(store.dispatch);
      return {
        ...store,
        dispatch,
      };
    };
  };
};
export default applyMiddleware;
