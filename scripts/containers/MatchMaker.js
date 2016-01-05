import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import engine from '../engine'
import { bindStateDecorator } from '../utils'

@autobind
export default class MatchMaker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playerId: 0,
      deckId: 0,
      connected: false
    }
  }

  componentWillMount() {
    engine.addOnConnected(this.handleSocketConection)
    engine.addOnGameFound(this.handleGameFound)
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

        <hr/>

        <textarea onChange={this.handleJson}></textarea>
        <button onClick={this.sendEvent}>Send Event</button>

      </div>
    )
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
}
