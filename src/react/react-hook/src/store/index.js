import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer"

//将redux-thunk包裹在applyMiddleware中使用redux-thunk中间件
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
