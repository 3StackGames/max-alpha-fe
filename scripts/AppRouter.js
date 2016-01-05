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
      <Route path='game' component={Game} />
      <IndexRoute component={MatchMaker} />
    </Route>
    <Route path='/sink' component={Sink} />
  </Router>
)

export default AppRouter
