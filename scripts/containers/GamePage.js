import React, { Component } from 'react'
import engine from '../engine'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as gameActs from '../ducks/game'
import * as uiActs from '../ducks/ui'
import autobind from 'autobind-decorator'
import { bindStateDecorator, stateLookups, stateChecks } from '../utils'
import { GameBoard } from '../components'

@connect(state => ({
  game: state.game,
  ui: state.ui
}))
@bindStateDecorator(engine)
export default class GamePage extends Component {
  constructor(props) {
    super(props)

    this.gameActs = bindActionCreators(gameActs, props.dispatch)
    this.uiActs = bindActionCreators(uiActs, props.dispatch)
    engine.emitter.on(engine.types.PLAYER_PROMPT, this.bindPrompts)
  }

  render() {
    const { props } = this
    return (
      <GameBoard
        game={props.game}
        ui={props.ui}
        gameActs={this.gameActs}
        uiActs={this.uiActs}
        engine={engine}
        lookup={this.lookup}
        check={this.check} />
    )
  }

  get lookup() {
    return stateLookups(this.props.game)
  }

  get check() {
    return stateChecks(this.props.game)
  }

  @autobind
  bindPrompts(data) {
    console.log('PROMPT UPDATE, YO!')
    console.log(data)
  }

  @autobind
  bindState() {
    this.gameActs.stateUpdate(engine.getState())
  }
}