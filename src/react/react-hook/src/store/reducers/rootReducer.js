import { combineReducers } from "redux";
import counter from './counterReducer'
import data from './dataReducer'

export default combineReducers({
  counter,data
})

