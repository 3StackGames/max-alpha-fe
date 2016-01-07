import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import engine from '../engine'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as gameActs from '../ducks/game'
import { bindStateDecorator } from '../utils'

@connect(state => ({
  game: state.game
}))
@autobind
@bindStateDecorator(engine)
export default class MatchMaker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playerId: 0,
      deckId: 0,
      connected: false
    }

    this.gameActs = bindActionCreators(gameActs, props.dispatch)
  }

  componentWillMount() {
    engine.addOnConnected(this.handleSocketConection)
    engine.addOnGameFound(this.handleGameFound)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.game.state && nextProps.game.state.players) {
      nextProps.history.pushState(null, `${nextProps.location.pathname}game`)
    }
  }

  componentWillUnmount() {
    engine.removeOnConnected(this.handleSocketConection)
    engine.removeOnConnected(this.handleGameFound)
  }

  render() {
    if (!this.state.connected) {
      return (
        <div>
          CONNECTING TO SERVER
        </div>
      )
    }

    return (
      <div>
        <input onChange={this.handlePlayerId} />
        <input onChange={this.handleDeckId} />
        <button onClick={this.handleFindGame}>Find Game</button>
        <button onClick={this.handleReadyGame}>I'm Ready</button>
        {
          this.state.playerReadySent
            ? <span>Waiting for other player to accept...</span>
            : null
        }
        <hr/>

        <textarea onChange={this.handleJson}></textarea>
        <button onClick={this.sendEvent}>Send Event</button>

      </div>
    )
  }

  handleReadyGame() {
    engine.send({
      eventType: 'Player Ready',
      gameCode: this.gameCode,
      playerId: this.state.playerId
    })
  }

  handleJson(e) {
    this.setState({
      eventData: e.target.value
    })
  }

  sendEvent() {
    engine.send(JSON.parse(this.state.eventData))
  }

  handleSocketConection() {
    this.setState({
      connected: true
    })
  }

  handleGameFound(data) {
    console.log(data)
    this.gameCode = data.gameCode
    this.gameActs.setGameCode(data.gameCode)
    this.gameActs.setPlayer(data.playerId)
  }

  handlePlayerId(e) {
    this.setState({
      playerId: e.target.value
    })
  }

  handleDeckId(e) {
    this.setState({
      deckId: e.target.value
    })
  }

  handleFindGame(e) {
    e.target.disabled = true
    engine.send({
      eventType: engine.types.FIND_GAME,
      playerId: this.state.playerId,
      deckId: this.state.deckId
    })
  }

  bindState() {
    this.gameActs.stateUpdate(engine.getState())
  }
}
