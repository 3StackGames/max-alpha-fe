import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './ducks/reducer'

const logger = createLogger()
const configureStore = applyMiddleware(
  thunk
)(createStore)

export default configureStore(rootReducer)
