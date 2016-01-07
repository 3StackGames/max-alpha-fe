import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import engine from '../engine'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as gameActs from '../ducks/game'
import * as uiActs from '../ducks/ui'
import { bindStateDecorator, bindStateLookups } from '../utils'
import {
  Hand,
  Card,
  ResourceOrb,
  WorkerOrb
} from '../components'
import titleCase from 'title-case'

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

    this.lookup = bindStateLookups(this, this.props.game)
    this.gameActs = bindActionCreators(gameActs, props.dispatch)
    this.uiActs = bindActionCreators(uiActs, props.dispatch)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.game !== nextProps.game) {
      this.lookup = bindStateLookups(this, nextProps.game)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.ui.attackingCard && prevProps.ui.attackingCard !== this.props.ui.attackingCard) {
      this.declareAttackAction()
    }
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
            <div className='FieldGroup CenterField-Player'>
              <div className='LeftGroup'>
                <div className='StructGroup-wrap'>
                  Structures
                </div>
              </div>
              <div className='RightGroup'>
                <div className='HandGroup-wrap'>
                  <Hand
                    ui={this.props.ui}
                    uiActs={this.uiActs}
                    cards={this.lookup.opponent.hand().map(id => this.lookup.card(id))}
                    opponent={true} />
                </div>
                <div className='CreatureGroup-wrap'>
                  {this.opponentCreatureNodes}
                </div>
              </div>
            </div>
            <div className='FieldGroup UIBar'>
              <div className='ActionView-wrap'>
                <div className='ActionView'>
                  {this.actionViewNode}
                </div>
              </div>
              <div className='ActionUIView-wrap'>
                <div className='ActionUIView'>
                  {this.actionUIViewNode}
                </div>
              </div>
              <div className='ZoomView-wrap'>
                <div className='ZoomView'>
                  {this.zoomViewNode}
                </div>
              </div>
            </div>
            <div className='FieldGroup CenterField-Player'>
              <div className='LeftGroup'>
                <div className='StructGroup-wrap'>
                  Structures
                </div>
              </div>
              <div className='RightGroup'>
                <div className='CreatureGroup-wrap'>
                  {this.playerCreatureNodes}
                </div>
                <div className='HandGroup-wrap'>
                  <Hand
                    ui={this.props.ui}
                    uiActs={this.uiActs}
                    cards={this.lookup.self.hand().map(id => this.lookup.card(id))} />
                </div>
              </div>
            </div>
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
                  {this.opponentNexusNode}
                </div>
              </div>
            </div>
            <div className='RightField-section'>
              <div className='PhaseAction-wrap'>
                {this.phaseActionNode}
              </div>
            </div>
            <div className='RightField-section RightField-player'>
              <div className='NexusPane-wrap FieldGroup'>
                {this.playerNexusNode}
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

  // Getters for common state values
  // get player() {
  //   return this.props.game.state.players.find(player => player.playerId === this.props.game.currentPlayer)
  // }

  // get opponent() {
  //   return this.props.game.state.players.find(player => player.playerId !== this.props.game.currentPlayer)
  // }

  // get playerHandCards() {
  //   return this.player.hand.cardIds.map(id => this.props.game.cardList[id].value)
  // }

  // get opponentHandCards() {
  //   return this.lookup.opponent.hand().map(id => this.lookup.card(id))
  // }

  // get playerDeckCards() {
  //   return this.player.deck.cardIds
  // }

  // get opponentDeckCards() {
  //   return this.opponent.deck.cardIds
  // }

  // get playerStructureCards() {
  //   return this.player.deck.buildables.cardIds
  // }

  // get opponentStructureCards() {
  //   return this.opponent.deck.buildables.cardIds
  // }

  // lookupCard(id) {
  //   const card = this.props.game.cardList[id]
  //   return card
  //     ? card.value
  //     : { id }
  // }

  get playerDeckNodes() {
    return this.lookup.self.deck().map((card, i) => (
      <div key={i} className='Deck-card' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get opponentDeckNodes() {
    return this.lookup.opponent.deck().map((id, i) => (
      <div key={i} className='Deck-card' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get playerStructureDeckNodes() {
    return this.lookup.self.structures().map((id, i) => (
      <div key={i} className='Deck-card' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get opponentStructureDeckNodes() {
    return this.lookup.opponent.structures().map((card, i) => (
      <div key={i} className='Deck-card' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get playerGraveNodes() {
    return this.lookup.self.grave().map((card, i) => (
      <div key={i} className='Grave-card' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get opponentGraveNodes() {
    return this.lookup.opponent.grave().map((card, i) => (
      <div key={i} className='Grave-card Grave-card-opponent' style={{ transform: `translateX(${i * -0.25}px)` }}>
      </div>
    ))
  }

  get playerPoolNodes() {
    const colorResources = this.lookup.self.player().resources.colors
    const nonemptyColorResources = Object.keys(colorResources)
      .filter(color => colorResources[color] > 0)

    return nonemptyColorResources.length === 0
      ? 'none'
      : nonemptyColorResources.map((color, i) => (
        <ResourceOrb key={i} color={color} value={colorResources[color]} />
      ))
  }

  get opponentPoolNodes() {
    const colorResources = this.lookup.opponent.player().resources.colors
    const nonemptyColorResources = Object.keys(colorResources)
      .filter(color => colorResources[color] > 0)

    return nonemptyColorResources.length === 0
      ? 'none'
      : nonemptyColorResources.map((color, i) => (
        <ResourceOrb key={i} color={color} value={colorResources[color]} />
      ))
  }

  get playerWorkerNodes() {
    return this.lookup.self.town().length === 0
      ? 'none'
      : this.lookup.self.town()
      .map((id, i) => {
        const color = this.lookup.card(id).dominantColor.toUpperCase()
        return (
          <WorkerOrb
            key={i}
            id={id}
            color={color}
            zoomState={this.props.ui.zoomedCard === id}
            selectState={this.props.ui.selectedCard === id}
            onOrbClick={this.handleOrbClick}
            onOrbOver={this.handleOrbMouseOver}
            onOrbOut={this.handleOrbMouseOut} />
        )
      })
  }

  handleOrbClick(e, id) {
    this.uiActs.selectCard(id)
  }

  handleOrbMouseOver(e, id) {
    this.uiActs.zoomCard(id)
  }

  handleOrbMouseOut(e, id) {
    this.uiActs.zoomCard(null)
  }

  get opponentWorkerNodes() {
    return 'none'
  }

  get playerCreatureNodes() {
    return this._createNodes('self')
  }

  get opponentCreatureNodes() {
    return this.lookup.opponent.field()
      .map(id => this.lookup.card(id))
      .map((card, i) => {
        return (
          <Card
            key={i}
            shrink={this.lookup.opponent.field().length > 6}
            type='field'
            id={card.id}
            zoomState={this.props.ui.zoomedCard === card.id}
            selectState={this.props.ui.selectedCard === card.id}
            onCardMouseOver={(e, id) => this.uiActs.zoomCard(id)}
            onCardMouseOut={(e, id) => this.uiActs.zoomCard(null)}
            onCardClick={(e, id) => this.uiActs.selectCard(id)}
            {...card} />
        )
      })
  }

  _createNodes(target) {
    return this.lookup[target].field()
      .map(id => this.lookup.card(id))
      .map((card, i) => {
        return (
          <Card
            key={i}
            shrink={this.lookup[target].field().length > 6}
            type='field'
            id={card.id}
            zoomState={this.props.ui.zoomedCard === card.id}
            selectState={this.props.ui.selectedCard === card.id}
            onCardMouseOver={(e, id) => this.uiActs.zoomCard(id)}
            onCardMouseOut={(e, id) => this.uiActs.zoomCard(null)}
            onCardClick={(e, id) => this.uiActs.selectCard(id)}
            {...card} />
        )
      })
  }

  get playerNexusNode() {
    const castle = this.lookup.self.player().castle
    return (
      <div
        className='Nexus'
        onClick={() => this.uiActs.selectCard(castle.id)}>
        {castle.currentHealth}
      </div>
    )
  }

  get opponentNexusNode() {
    const castle = this.lookup.opponent.player().castle
    return (
      <div
        className='Nexus'
        onClick={() => this.uiActs.selectCard(castle.id)}>
        {castle.currentHealth}
      </div>
    )
  }

  UIPlayAction() {
    this.uiActs.declarePlayCard(this.props.ui.selectedCard)
  }

  UIAssignCostAction(color, value) {
    this.uiActs.assignCost(color, value)
  }

  UIAttackAction() {
    this.uiActs.declareAttackCard(this.props.ui.selectedCard)
    this.uiActs.selectCard(null)
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
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Play Card',
        playerId: this.props.game.currentPlayer,
        cardId: this.props.ui.selectedCard,
        cost: this.props.ui.cost
      }
    })
  }

  pullAction() {

  }

  declareAttackAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Declare Attacker',
        playerId: this.props.game.currentPlayer,
        cardId: this.props.ui.attackingCard
      }
    })
  }

  singleTargetPromptAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Single Target Prompt',
        playerId: this.props.game.currentPlayer,
        cardId: this.props.ui.selectedCard
      }
    })
  }

  finishPhaseAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Finish Phase',
        playerId: this.props.game.currentPlayer
      }
    })
  }

  get actionViewNode() {
    const cardId = this.props.ui.selectedCard
    if (!cardId) {
      return
    } 
    
    if (this.inLocation('self', 'field', cardId)) {
      return [
        <button onClick={this.UIAttackAction}>Attack</button>
      ]
    }

    if (this.inLocation('self', 'hand', cardId)) {
      return [
        <button onClick={this.UIPlayAction}>Play</button>,
        <button onClick={this.assignAction}>Assign</button>
      ]
    }

    if (this.inLocation('self', 'town', cardId)) {
      return [
        <button onClick={this.pullAction}>Pull</button>
      ]
    }
  }

  inLocation(target, location, findId) {
    return this.lookup[target][location]().find(id => id === findId)
  }

  get actionUIViewNode() {
    if (this.props.ui.playingCard) {
      return this.playingActionUIViewNode
    }

    if (this.props.game.state.promptQueue.length > 0) {
      return this.promptUINode
    }
  }

  get playingActionUIViewNode() {
    const cardId = this.props.ui.playingCard
    const playerResources = this.lookup.self.player().resources.colors
    const costButtonNodes = Object.keys(playerResources)
      .filter(color => playerResources[color] > 0)
      .map(color => {
        const colorValue = this.props.ui.cost.colors[titleCase(color)] || 0
        return (
          <div key={color}>
            <button
              onClick={() => this.uiActs.assignCost(color, colorValue + 1)}>
              {color}: {colorValue}
            </button>
          </div>
        )
      })

    const card = this.lookup.card(cardId)
    const cardCost = card.currentCost.colors
    const costNodes = Object.keys(cardCost)
      .filter(color => cardCost[color] > 0)
      .map(color => (
        <span key={color}>{color}: {cardCost[color]} </span>
      ))
    const playCard = () => {
      this.playAction()
      this.uiActs.declarePlayCard(null)
      this.uiActs.selectCard(null)
    }

    return (
      <div>
        <div>{costNodes}</div>
        {costButtonNodes}
        <button onClick={() => this.uiActs.declarePlayCard(null)}>Cancel</button>
        <button onClick={() => playCard()}>PLAY</button>
      </div>
    )
  }

  get attackingActionUIViewNode() {
    const { selectedCard } = this.props.ui
    if (selectedCard) {
      return (
        <div>
          <p>Targetting: {this.lookup.card(selectedCard).name}</p>
          <button onClick={this.declareAttackAction}>Attack</button>
        </div>
      )
    }
    return (
      <div>
        <p>Choose a target</p>
      </div>
    )
  }

  get promptUINode() {
    const { selectedCard } = this.props.ui
    if (selectedCard) {
      return (
        <div>
          <p>Targetting: {this.lookup.card(selectedCard).name}</p>
          <button onClick={this.singleTargetPromptAction}>Attack</button>
        </div>
      )
    }
    return (
      <div>
        <p>Choose a target</p>
      </div>
    )
  }

  get zoomViewNode() {
    if (!this.props.ui.zoomedCard) {
      return
    }

    return (
      <pre>{JSON.stringify(this.lookup.card(this.props.ui.zoomedCard), null, 2)}</pre>
    )
  }

  get phaseActionNode() {
    let buttonText = ''
    const phaseName = this.props.game.state.currentPhase.name
    switch (phaseName) {
      case 'Main Phase':
        buttonText = this.props.game.state.combatEnded
          ? 'END TURN'
          : 'DECLARE ATTACKERS'
        break
      case 'Attack Phase':
        buttonText = 'PREPARE BLOCKERS'
        break
      case 'Block Phase':
        buttonText = 'TO MAIN PHASE'
        break
      default:
        buttonText = phaseName
    }

    return (
      <div>
        <p>{phaseName}</p>
        <button
          className='PhaseAction'
          onClick={this.finishPhaseAction}>{buttonText}</button>
      </div>
    )
  }

  bindState() {
    this.gameActs.stateUpdate(engine.getState())
  }
}