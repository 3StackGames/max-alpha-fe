import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import engine from '../engine'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as gameActs from '../ducks/game'
import { bindStateDecorator } from '../utils'

const player1Id = '5692c8785874ab801b000001'
const player2Id = '5696e9f35874ab801b000004'
const deckId = '568ec4b9bbdcf16c2c000003'

@connect(state => ({
  game: state.game
}))
@autobind
export default class MatchMaker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playerId: 0,
      deckId: 0,
      connected: false
    }

    engine.emitter.on(engine.types.STATE_UPDATE, this.bindState)
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
        <button onClick={() => this.findGame(player1Id)}>Find game as PLAYER 1</button>
        <button onClick={() => this.findGame(player2Id)}>Find game as PLAYER 2</button>
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
      playerId: this.state.playerId,
      gameCode: this.props.game.gameCode,
      ready: true
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
    this.gameActs.setGameCode(data.gameCode)
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

  findGame(id) {
    engine.send({
      deckId,
      eventType: engine.types.FIND_GAME,
      playerId: id
    })
    this.setState({
      playerId: id
    })
  }
  // handleFindGame(e) {
  //   // e.target.disabled = true
  //   engine.send({
  //     eventType: engine.types.FIND_GAME,
  //     playerId: this.state.playerId,
  //     deckId: this.state.deckId
  //   })
  // }

  @autobind
  bindState(data) {
    this.gameActs.stateUpdate({
      state: data.state,
      cardList: data.cardList,
      currentPlayer: data.currentPlayer
    })
  }
}
