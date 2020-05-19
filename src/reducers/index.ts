import { combineReducers } from 'redux'
import counter from './counter'
import pageIndex from './page-index'
import exampleDetail from './detail'

export default combineReducers({
  counter,
  pageIndex,
  exampleDetail,
})
