import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import engine from '../engine'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as gameActs from '../ducks/game'
import * as uiActs from '../ducks/ui'
import { bindStateDecorator } from '../utils'
import {
  Hand,
  Card,
  ResourceOrb
} from '../components'

@connect(state => ({
  game: state.game,
  ui: state.ui
}))
@autobind
@bindStateDecorator(engine)
export default class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCard: null
    }

    this.gameActs = bindActionCreators(gameActs, props.dispatch)
    this.uiActs = bindActionCreators(uiActs, props.dispatch)
  }

  render() {
    const { props } = this
    return (
      <div className='Field'>
        <div className='Field-wrap'>
          <div className='LeftField'>
            <div className='LeftField-section LeftField-Opponent'>
              <div className='Deck-wrap FieldGroup'>
                <div className='Deck'>
                  <label className='FieldGroup-label'>DECK</label>
                  {this.opponentDeckNodes}
                </div>
              </div>
              <div className='Grave-wrap FieldGroup'>
                <div className='Deck Grave'>
                  <label className='FieldGroup-label'>GRAVE</label>
                  {this.opponentGraveNodes}
                </div>
              </div>
              <div className='StructureDeck-wrap FieldGroup'>
                <div className='Deck StructureDeck'>
                  <label className='FieldGroup-label'>STRUCTS</label>
                  {this.opponentStructureDeckNodes}
                </div>
              </div>
            </div>
            <div className='LeftField-section LeftField-Player'>
              <div className='Grave-wrap FieldGroup'>
                <div className='Deck Grave'>
                  <label className='FieldGroup-label'>GRAVE</label>
                  {this.playerGraveNodes}
                </div>
              </div>
              <div className='StructureDeck-wrap FieldGroup'>
                <div className='Deck StructureDeck'>
                  <label className='FieldGroup-label'>STRUCTS</label>
                  {this.playerStructureDeckNodes}
                </div>
              </div>
              <div className='Deck-wrap FieldGroup'>
                <div className='Deck'>
                  <label className='FieldGroup-label'>DECK</label>
                  {this.playerDeckNodes}
                </div>
              </div>
            </div>
          </div>
          <div className='CenterField'>
            <Hand uiActs={this.uiActs} cards={this.opponentHandCards} opponent={true} />
            <div className='ActionBar'>
              <button onClick={this.assignAction}>Assign</button>
              <button onClick={this.playAction}>Play</button>
            </div>
            <Hand uiActs={this.uiActs} cards={this.playerHandCards} />
          </div>
          <div className='RightField'>
            <div className='RightField-section RightField-opponent'>
              <div className='ResourcePane-wrap FieldGroup'>
                <div className='ResourcePane-pool'>
                  <div>Resources</div>
                  {this.opponentPoolNodes}
                </div>
                <div className='ResourcePane-workers'>
                  <div>Workers</div>
                  {this.opponentWorkerNodes}
                </div>
              </div>
              <div className='NexusPane-wrap FieldGroup'>
                <div className='Nexus'>
                  {this.playerNexusNode}
                </div>
              </div>
            </div>
            <div className='RightField-section RightField-player'>
              <div className='NexusPane-wrap FieldGroup'>
                <div className='Nexus'>
                  {this.playerNexusNode}
                </div>
              </div>
              <div className='ResourcePane-wrap FieldGroup'>
                <div className='ResourcePane-pool'>
                  <div>Resources</div>
                  {this.playerPoolNodes}
                </div>
                <div className='ResourcePane-workers'>
                  <div>Workers</div>
                  {this.playerWorkerNodes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  get player() {
    const { props } = this
    return  props.game.state.players.find(player => player.playerId === props.game.currentPlayer)
  }
  get opponent() {
    const { props } = this
    return props.game.state.players.find(player => player.playerId !== props.game.currentPlayer)
  }

  get playerHandCards() {
    const { props } = this
    return this.player.hand.map(card => props.game.state.cardList[card.id])
  }

  get opponentHandCards() {
    const { props } = this
    return this.opponent.hand.map(card => props.game.state.cardList[card.id])
  }

  get playerDeckNodes() {
    return this.player.deck.cards.map((card, i) => (
      <div key={i} className='Deck-card' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get opponentDeckNodes() {
    return this.opponent.deck.cards.map((card, i) => (
      <div key={i} className='Deck-card' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get playerStructureDeckNodes() {
    return this.player.structures.map((card, i) => (
      <div key={i} className='Deck-card' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get opponentStructureDeckNodes() {
    return this.opponent.structures.map((card, i) => (
      <div key={i} className='Deck-card' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get playerGraveNodes() {
    return this.player.grave.map((card, i) => (
      <div key={i} className='Grave-card' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get opponentGraveNodes() {
    return this.opponent.grave.map((card, i) => (
      <div key={i} className='Grave-card Grave-card-opponent' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get playerPoolNodes() {
    const colorResources = this.player.resources.colors
    const nonemptyColorResources = Object.keys(colorResources)
      .filter(color => colorResources[color] > 0)

    return nonemptyColorResources.length === 0
      ? 'none'
      : nonemptyColorResources.map((color, i) => (
        <ResourceOrb key={i} color={color} value={colorResources[color]} />
      ))
  }

  get playerWorkerNodes() {
    return 'none'
  }

  get opponentPoolNodes() {
    const colorResources = this.opponent.resources.colors
    const nonemptyColorResources = Object.keys(colorResources)
      .filter(color => colorResources[color] > 0)

    return nonemptyColorResources.length === 0
      ? 'none'
      : nonemptyColorResources.map((color, i) => (
        <ResourceOrb key={i} color={color} value={colorResources[color]} />
      ))
  }

  get opponentWorkerNodes() {
    return 'none'
  }

  get playerNexusNode() {
    return (
      <div>
        {this.player.base.health}
      </div>
    )
  }

  get opponentNexusNode() {
    return (
      <div>
        {this.opponent.base.health}
      </div>
    )
  }

  selectCard(cardId) {
    this.setState({
      selectedCard: cardId
    })
  }

  assignAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        playerId: this.props.game.currentPlayer,
        type: "Assign Card",
        cardId: this.props.ui.selectedCard
      }
    })
  }

  playAction() {

  }

  bindState() {
    this.gameActs.stateUpdate(engine.getState())
  }
}