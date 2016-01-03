import React from 'react'
import { Router, Route, Link, IndexRoute, Redirect } from 'react-router'
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import {
  App,
  Sink
} from './containers'

const AppRouter = (
  <Router>
    <Route path='/' component={App} />
    <Route path='/sink' component={Sink} />
  </Router>
)

export default AppRouter
