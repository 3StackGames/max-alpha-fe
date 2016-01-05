import React from 'react'
import { Router, Route, Link, IndexRoute, Redirect } from 'react-router'
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import {
  App,
  Sink,
  MatchMaker,
  Game
} from './containers'

const AppRouter = (
  <Router>
    <Route path='/' component={App}>
      <IndexRoute component={MatchMaker} />
      <Route path='game' component={Game} />
    </Route>
    <Route path='/sink' component={Sink} />
  </Router>
)

export default AppRouter
