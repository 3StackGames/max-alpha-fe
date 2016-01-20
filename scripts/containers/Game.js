import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import engine from '../engine'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as gameActs from '../ducks/game'
import * as uiActs from '../ducks/ui'
import { bindStateDecorator, lookupDecorator } from '../utils'
import {
  Hand,
  Card,
  ResourceOrb,
  WorkerOrb,
  FaceDownCard,
  Town,
  Field,
  Castle
} from '../components'
import titleCase from 'title-case'
import R from 'ramda'

import { DragSource, DropTarget } from 'react-dnd'
const CARD = 'CARD'
const WORKER = 'WORKER'

const target = {
  canDrop(props, monitor) {
    if (monitor.getItemType() === CARD) {
      return true
    }

    if (monitor.getItemType() === WORKER) {
      return true
    }

    return false
  },

  drop(props, monitor, component) {
    console.log('DROP')
    console.log(monitor.getItemType())
    // Card being dropped in a worker zone
    if (monitor.getItemType() === CARD) {
      component.uiActs.selectCard(monitor.getItem().id)
      component.assignAction()
    }

    // Worker being dropped in a hand zone
    if (monitor.getItemType() === WORKER) {
      component.uiActs.selectCard(monitor.getItem().id)
      component.pullAction()
    }
  }
}

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
    engine.emitter.on(engine.types.PLAYER_PROMPT, this.bindPrompts)
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.game !== nextProps.game) {
    //   this.lookup = bindStateLookups(this, nextProps.game)
    // }

    if (nextProps.ui.playingCard && nextProps.ui.selectedCard !== nextProps.ui.playingCard) {
      this.uiActs.cancelDeclaration()
    }
  }

  render() {
    const { props } = this
    return (
      <div className='board-container'>
        <div className='opponent-container'>
          <div className='collections-container'>
            <div className='deck-container'>
              <div className='container-label'><span>DECK</span></div>
              <div className='deck-body'>
                <div className='deck-placeholder'>
                  {this.deckNodes('opponent')}
                </div>
              </div>
            </div>
            <div className='grave-container'>
              <div className='container-label'><span>GRAVE</span></div>
              <div className='grave-body'>
              </div>
            </div>
            <div className='structures-container'>
              <div className='container-label'><span>STRUCTS</span></div>
              <div className='structures-body'>
                {this.structureNodes('opponent')}
              </div>
            </div>
          </div>
          <div className='courtyard-container'>
            {this.courtyardNodes('opponent')}
          </div>
          <div className='playing-container'>
            <Hand
              lookup={this.lookup}
              check={this.check}
              ui={this.props.ui}
              uiActs={this.uiActs}
              game={this.props.game}
              pullAction={this.pullAction}
              player='opponent' />
            <Field
              lookup={this.lookup}
              check={this.check}
              ui={this.props.ui}
              uiActs={this.uiActs}
              game={this.props.game}
              smoothAttackAction={this.smoothAttackAction}
              smoothBlockAction={this.smoothBlockAction}
              player='opponent' />
          </div>
          <div className='resources-container'>
            <Town
              lookup={this.lookup}
              check={this.check}
              ui={this.props.ui}
              uiActs={this.uiActs}
              game={this.props.game}
              assignAction={this.assignAction}
              player='opponent' />
            <div className='resource-indicator-container'>
              <div className='resource-indicator-body'>
                <div className='resource-row'>
                  {this.resourceNode('opponent', 'WHITE')}
                  {this.resourceNode('opponent', 'BLUE')}
                </div>
                <div className='resource-row'>
                  {this.resourceNode('opponent', 'YELLOW')}
                  {this.resourceNode('opponent', 'COLORLESS')}
                  {this.resourceNode('opponent', 'GREEN')}
                </div>
                <div className='resource-row'>
                  {this.resourceNode('opponent', 'RED')}
                  {this.resourceNode('opponent', 'BLACK')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={cx('actions-container', {
            'actions-container--zoomed': this.props.ui.zoomedCard
          })}>
          <div className='zoom-container'>
            <div className='zoom-body'>
              {this.zoomNode}
            </div>
          </div>
          <div className='phase-container'>
            <div className='currentphase-group group'>
              {this.props.game.state.currentPhase.name}
            </div>
            <div className='endphase-group group'>
              {this.endPhaseNode}
            </div>
          </div>
          <div className='prompt-container'>
            {this.promptNode}
          </div>
          <div className='castles-container'>
            <Castle
              lookup={this.lookup}
              check={this.check}
              ui={this.props.ui}
              uiActs={this.uiActs}
              game={this.props.game}
              smoothAttackAction={this.smoothAttackAction}
              player='opponent' />
            <Castle
              lookup={this.lookup}
              check={this.check}
              ui={this.props.ui}
              uiActs={this.uiActs}
              game={this.props.game}
              smoothAttackAction={this.smoothAttackAction}
              player='self' />
          </div>
        </div>
        <div className='self-container'>
          <div className='collections-container'>
            <div className='structures-container'>
              <div className='container-label'><span>STRUCTS</span></div>
              <div className='structures-body'>
                {this.structureNodes('self')}
              </div>
            </div>
            <div className='grave-container'>
              <div className='container-label'><span>GRAVE</span></div>
              <div className='grave-body'>
              </div>
            </div>
            <div className='deck-container'>
              <div className='container-label'><span>DECK</span></div>
              <div className='deck-body'>
                <div className='deck-placeholder'>
                  {this.deckNodes('self')}
                </div>
              </div>
            </div>
          </div>
          <div className='courtyard-container'>
            {this.courtyardNodes('self')}
          </div>
          <div className='playing-container'>
            <Field
              lookup={this.lookup}
              check={this.check}
              ui={this.props.ui}
              uiActs={this.uiActs}
              game={this.props.game}
              smoothAttackAction={this.smoothAttackAction}
              player='self' />
            <Hand
              lookup={this.lookup}
              check={this.check}
              ui={this.props.ui}
              uiActs={this.uiActs}
              game={this.props.game}
              pullAction={this.pullAction}
              player='self' />
          </div>
          <div className='resources-container'>
            <div className='resource-indicator-container'>
              <div className='resource-indicator-body'>
                <div className='resource-row'>
                  {this.resourceNode('self', 'WHITE')}
                  {this.resourceNode('self', 'BLUE')}
                </div>
                <div className='resource-row'>
                  {this.resourceNode('self', 'YELLOW')}
                  {this.resourceNode('self', 'COLORLESS')}
                  {this.resourceNode('self', 'GREEN')}
                </div>
                <div className='resource-row'>
                  {this.resourceNode('self', 'RED')}
                  {this.resourceNode('self', 'BLACK')}
                </div>
              </div>
            </div>
            <Town
              lookup={this.lookup}
              check={this.check}
              ui={this.props.ui}
              uiActs={this.uiActs}
              game={this.props.game}
              assignAction={this.assignAction}
              player='self' />
          </div>
        </div>
      </div>
    )
  }

  mapIdToCard(id) {
    return this.lookup.card(id)
  }

  get zoomNode() {
    const { zoomedCard } = this.props.ui
    if (!zoomedCard) {
      return [
        <div key={0} className='zoom-image-group group'>
        </div>,
        <div key={1} className='zoom-info-group group'>
        </div>,
        <div key={2} className='zoom-effects-group group'>
        </div>
      ]
    }
    const card = this.lookup.card(zoomedCard)
    const costNodes = Object.keys(card.currentCost.colors)
      .filter(color => card.currentCost.colors[color] > 0)
      .map(color => {
      return (
        <ResourceOrb key={color} color={color} value={card.currentCost.colors[color]} />
      )
  })
    return [
      <div key={0} className='zoom-image-group group'>
        <img className='zoom-image' src='http://placehold.it/200x200'/>
      </div>,
      <div key={1} className='zoom-info-group group'>
        <div className='zoom-name'>{card.name}</div>
        <div className='zoom-cost'>{costNodes}</div>
        <div className='zoom-stats-group group'>
          {
            card.attack
              ? <div className='zoom-attack'>ATK: {card.attack}</div>
              : null 
          }
          <div className='zoom-health'>HP: {card.currentHealth}/{card.health}</div>
        </div>
      </div>,
      <div key={2} className='zoom-effects-group group'>
        <div className='zoom-effect'>Some effect that this card has.</div>
      </div>
    ]
  }

  get promptNode() {
    const { selectedCard, playingCard } = this.props.ui
    const { promptQueue } = this.props.game

    if (
      !selectedCard
      && !playingCard
      && promptQueue.length === 0
    ) {
      return
    }

    if (promptQueue.length > 0) {
      return [
        <div key={0} className='prompt-item'>{selectedCard ? 'Selected: ' + this.lookup.card(selectedCard).name : 'Select a target'}</div>,
        <div key={1} className='prompt-item'><button onClick={this.singleTargetPromptAction}>TARGET</button></div>
      ]
    }

    if (playingCard) {
      const colorResources = this.lookup.self.player().resources.colors
      return [
        <div key={0} className='prompt-item'>
          Cost: (1)(2)(3)
        </div>,
        <div key={1} className='prompt-item'>
          {
            Object.keys(colorResources)
              .filter(color => colorResources[color] > 0)
              .map(color => (
                <button onClick={() => this.uiActs.assignCost(color, (this.props.ui.cost.colors[color]) + 1)}>{color}: {this.props.ui.cost.colors[color]}</button>
              ))
          }
        </div>,
        <div key={2} className='prompt-item'>
          <button onClick={this.playAction}>PLAY</button>
        </div>
      ]
    }

    if (this.check.inLocation('self', 'hand', selectedCard)) {
      if (!this.hasAssignedOrPulled('self')) {
        return this.buildPromptButtons(this.playButton, this.assignButton)
      }

      return this.buildPromptButtons(this.playButton)
    }

    if (this.check.inLocation('self', 'structures', selectedCard)) {
      return this.buildPromptButtons(this.playButton)
    }

    if (this.check.inLocation('self', 'creatures', selectedCard)) {
      if (this.check.isPhase('Attack Phase') && this.check.isTurn('self')) {
        return this.buildPromptButtons(this.attackButton)
      }

      if (this.check.isPhase('Block Phase') && this.check.isTurn('opponent')) {
        return this.buildPromptButtons(this.blockButton)
      }
    }

    if (
      this.check.inLocation('self', 'town', selectedCard) 
      && !this.hasAssignedOrPulled('self')
    ) {
      return this.buildPromptButtons(this.pullButton)
    }
  }

  buildPromptButtons(...buttons) {
    return buttons.map((button, i) => (
      <div key={i} className='prompt-item'>{button}</div>
    ))
  }

  get playButton() {
    return <button onClick={this.UIPlayAction}>Play</button>
  }

  get assignButton() {
    return <button onClick={this.assignAction}>Assign</button>
  }

  get attackButton() {
    return <button onClick={this.UIAttackAction}>Attack</button>
  }

  get blockButton() {
    return <button onClick={this.UIBlockAction}>Block</button>
  }

  get pullButton() {
    return <button onClick={this.pullAction}>Pull</button>
  }

  courtyardNodes(target) {
    return this.lookup[target].courtyard()
      .map(this.mapIdToCard)
      .map(structure => (
        <div
          className={cx('courtyard-card', {
            'courtyard-card--selected': this.props.ui.selectedCard === structure.id
          })}
          onClick={e => this.handleStructureClick(e, structure.id)}
          onMouseOver={e => this.handleStructureMouseOver(e, structure.id)}
          onMouseOut={e => this.handleStructureMouseOut(e, structure.id)}>
          <div>Name: {structure.name}</div>
          <div>HP: {structure.currentHealth}</div>
        </div>
      ))
  }

  castleNode(target) {
    const { castle } = this.lookup[target].player()
    return (
      <div
        className={cx('castle-body', {
          'castle-body--selected': this.props.ui.selectedCard === castle.id
        })}
        onClick={e => this.handleCastleClick(e, castle.id)}>
        {castle.currentHealth}
      </div>
    )
  }

  handNodes(target) {
    return (
      <Hand
        ui={this.props.ui}
        cards={this.lookup[target].hand().map(this.mapIdToCard)}
        onCardClick={this.handleHandCardClick}
        onCardMouseOver={this.handleHandCardMouseOver}
        onCardMouseOut={this.handleHandCardMouseOut}
        opponent={target === 'opponent'} />
    )
  }

  creatureNodes(target) {
    return this.lookup[target].creatures()
      .map(this.mapIdToCard)
      .map((card, i) => (
        <Card
          key={i}
          shrink={this.lookup[target].creatures().length > 6}
          type='field'
          id={card.id}
          zoomState={this.props.ui.zoomedCard === card.id}
          selectState={this.props.ui.selectedCard === card.id}
          onCardClick={this.handleFieldCardClick}
          onCardMouseOver={this.handleFieldCardMouseOver}
          onCardMouseOut={this.handleFieldCardMouseOut}
          {...card} />
      ))
  }

  townNodes(target) {
    return this.lookup[target].town()
      .map((id, i) => {
        const color = this.lookup.card(id).dominantColor.toUpperCase()
        return (
          <WorkerOrb
            key={i}
            id={id}
            color={color}
            zoomState={this.props.ui.zoomedCard === id}
            selectState={this.props.ui.selectedCard === id}
            onOrbClick={this.handleWorkerClick}
            onOrbOver={this.handleWorkerMouseOver}
            onOrbOut={this.handleWorkerMouseOut} />
        )
      })
  }

  resourceNode(target, color) {
    return (
      <ResourceOrb
        color={color}
        value={this.lookup[target].player().resources.colors[color]} />
    )
  }

  deckNodes(target) {
    return this.lookup[target].deck().map((id, i) => (
      <FaceDownCard
        style={{ transform: `translateX(${ i * -0.5 }px)` }}
        key={i}
        type='deck' />
    ))
  }

  structureNodes(target) {
    return this.lookup[target].structures().map(id => (
      <div
        className={cx('struct-deck-item', {
          'struct-deck-item--selected': this.props.ui.selectedCard === id
        })}
        onClick={e => this.handleStructureDeckClick(e, id)}
        onMouseOver={e => this.handleStructureDeckMouseOver(e, id)}
        onMouseOut={e => this.handleStructureDeckMouseOut(e, id)}>
       {this.lookup.card(id).name}
      </div>
    ))
  }

  get endPhaseNode() {
    if (this.check.isTurn('self')) {
      if (this.check.isPhase('Main Phase')) {
        if (this.props.game.state.combatEnded) {
          return <button onClick={this.finishPhaseAction}>END TURN</button>
        }
        return [
          <button key={0} onClick={this.finishPhaseAction}>Move to Combat</button>,
          <button key={1} onClick={this.endTurnWithoutCombatAction}>END TURN</button>
        ]
      }

      if (this.check.isPhase('Attack Phase')) {
        return [
          <button key={0} onClick={this.finishPhaseAction}>Launch Attack</button>
        ]
      }
    }

    if (this.check.isTurn('opponent')) {
      if (this.check.isPhase('Block Phase')) {
        return (
          <button
            onClick={this.finishPhaseAction}>
            Finish Blocking
          </button>
        )
      }
    }
  }

  hasAssignedOrPulled(target) {
    return this.lookup[target].player().hasAssignedOrPulled
  }

  get currentPromptStep() {
    if (this.props.game.promptQueue.length === 0) {
      return null
    }

    const promptHead = this.props.game.promptQueue[0]
    return promptHead.steps[promptHead.currentStep]
  }

  get currentPlayerId() {
    return this.props.game.currentPlayer.playerId
  }

  handleCastleClick(e, id) {
    if (this.currentPromptStep) {
      if (this.currentPromptStep.targetables.find(target => target.id === id)) {
        this.uiActs.selectCard(id)
      }
    }
  }

  handleStructureClick(e, id) {
    // if (this.check.isPhase('Main Phase')) {
    //   if (this.check.inLocation('self', 'courtyard', id)) {
    //     this.uiActs.selectCard(id)
    //   }
    // }

    if (this.currentPromptStep) {
      if (this.currentPromptStep.targetables.find(target => target.id === id)) {
        this.uiActs.selectCard(id)
      }
    }
  }

  handleStructureMouseOver(e, id) {
    if (this.check.inLocation('self', 'courtyard', id)) {
      this.uiActs.zoomCard(id)
    }
  }

  handleStructureMouseOut(e, id) {
    if (this.check.inLocation('self', 'courtyard', id)) {
      this.uiActs.zoomCard(null)
    }
  }

  handleStructureDeckClick(e, id) {
    if (this.check.isPhase('Main Phase')) {
      if (this.check.inLocation('self', 'structures', id)) {
        this.uiActs.selectCard(id)
      }
    }

    if (this.currentPromptStep) {
      if (this.currentPromptStep.targetables.find(target => target.id === id)) {
        this.uiActs.selectCard(id)
      }
    }
  }

  handleStructureDeckMouseOver(e, id) {
    if (this.check.inLocation('self', 'structures', id)) {
      this.uiActs.zoomCard(id)
    }
  }

  handleStructureDeckMouseOut(e, id) {
    if (this.check.inLocation('self', 'structures', id)) {
      this.uiActs.zoomCard(null)
    }
  }
  
  handleHandCardClick(e, id) {
    if (
      this.check.isPhase('Main Phase')
      && this.check.isTurn('self')
      && this.check.inLocation('self', 'hand', id)
    ) {
        this.uiActs.selectCard(id)
    }
  }

  handleHandCardMouseOver(e, id) {
    if (this.check.inLocation('self', 'hand', id)) {
      this.uiActs.zoomCard(id)
    }
  }

  handleHandCardMouseOut(e, id) {
    if (this.check.inLocation('self', 'hand', id)) {
      this.uiActs.zoomCard(null)
    }
  }

  handleFieldCardClick(e, id) {
    if (
      this.check.isPhase('Attack Phase')
      && this.check.isTurn('self')
    ) {
      this.uiActs.selectCard(id)
    }

    if (
      // It's block phase
      this.props.game.state.currentPhase.name === 'Block Phase'
      // It's not your turn
      && this.props.game.state.players[this.props.game.state.turn].playerId !== this.currentPlayerId
    ) {
      if (
        // There's no prompt queue
        !this.props.game.promptQueue[0]
        // The card is on your field
        && this.lookup.self.creatures().find(fieldId => fieldId === id)
      ) {
        this.uiActs.selectCard(id)
      }
      else if (
        // There is a prompt queue
        this.props.game.promptQueue[0]
        // The card is targetable
        && this.props.game.promptQueue[0].steps[this.props.game.promptQueue[0].currentStep].targetables.find(target => target.id === id)
      ) {
        this.uiActs.selectCard(id)
      }
    }
  }

  UIPlayAction() {
    this.uiActs.declarePlayCard(this.props.ui.selectedCard)
  }

  UIAssignCostAction(color, value) {
    this.uiActs.assignCost(color, value)
  }

  UIAttackAction() {
    this.declareAttackAction()
    this.uiActs.selectCard(null)
  }

  UIBlockAction() {
    this.declareBlockAction()
    this.uiActs.selectCard(null)
  }

  assignAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        playerId: this.currentPlayerId,
        type: "Assign Card",
        cardId: this.props.ui.selectedCard
      }
    })
    this.uiActs.selectCard(null)
  }

  playAction() {
    const { selectedCard } = this.props.ui
    let playType

    if (this.check.inLocation('self', 'hand', selectedCard)) {
      playType = 'Play Card'
    }

    if (this.check.inLocation('self', 'structures', selectedCard)) {
      playType = 'Build Structure'
    }

    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: playType,
        playerId: this.currentPlayerId,
        cardId: selectedCard,
        cost: this.props.ui.cost
      }
    })
    this.uiActs.selectCard(null)
    this.uiActs.cancelDeclaration()
  }

  pullAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Pull Card',
        playerId: this.currentPlayerId,
        cardId: this.props.ui.selectedCard
      }
    })
    this.uiActs.selectCard(null)
  }

  declareAttackAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Declare Attacker',
        playerId: this.currentPlayerId,
        cardId: this.props.ui.selectedCard
      }
    })
    // this.uiActs.declareAttackCard(null)
  }

  declareBlockAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Declare Blocker',
        playerId: this.currentPlayerId,
        cardId: this.props.ui.selectedCard
      }
    })
    // this.uiActs.declareBlockCard(null)
  }

  singleTargetPromptAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Single Target Prompt',
        playerId: this.currentPlayerId,
        cardId: this.props.ui.selectedCard
      }
    })
    this.uiActs.selectCard(null)
  }

  finishPhaseAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Finish Phase',
        playerId: this.currentPlayerId
      }
    })
    this.uiActs.selectCard(null)
  }

  endTurnWithoutCombatAction() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'End Turn Without Combat',
        playerId: this.currentPlayerId
      }
    })
    this.uiActs.selectCard(null)
  }

  smoothAttackAction(attackerId, targetId) {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Declare Attacker',
        playerId: this.currentPlayerId,
        cardId: attackerId,
        targetId: targetId
      }
    })
  }

  smoothBlockAction(blockerId, targetId) {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Declare Blocker',
        playerId: this.currentPlayerId,
        cardId: blockerId,
        targetId: targetId
      }
    })
  }

  get playingActionUIViewNode() {
    const cardId = this.props.ui.playingCard
    const playerResources = this.lookup.self.player().resources.colors
    const costButtonNodes = Object.keys(playerResources)
      .filter(color => playerResources[color] > 0)
      .map(color => {
        const colorValue = this.props.ui.cost.colors[color] || 0
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
          <p>Targeting: {this.lookup.card(selectedCard).name}</p>
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
          <p>Targeting: {this.lookup.card(selectedCard).name}</p>
          <button onClick={this.singleTargetPromptAction}>Target</button>
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

  get lookup() {
    const lookupCard = id => {
      const card = this.props.game.cardList[id]
      return card.value || { id }
    }

    const self = () =>
      this.props.game.state.players[this.props.game.currentPlayer.playerIndex]

    const opponent = () =>
      this.props.game.state.players[this.props.game.currentPlayer.playerIndex === 0 ? 1 : 0]

    const lookupHand = target =>
      target.hand.cardIds

    const lookupDeck = target =>
      target.mainDeck.cardIds

    const lookupStructures = target =>
      target.structureDeck.cardIds

    const lookupGrave = target =>
      target.graveYard.cardIds

    const lookupCreatures = target =>
      target.field.cardIds

    const lookupCourtyard = target =>
      target.courtyard.cardIds

    const lookupTown = target =>
      target.town.cardIds

    return {
      card: lookupCard,
      self: {
        player: self,
        hand: R.pipe(self, lookupHand),
        deck: R.pipe(self, lookupDeck),
        structures: R.pipe(self, lookupStructures),
        grave: R.pipe(self, lookupGrave),
        creatures: R.pipe(self, lookupCreatures),
        courtyard: R.pipe(self, lookupCourtyard),
        town: R.pipe(self, lookupTown)
      },
      opponent: {
        player: opponent,
        hand: R.pipe(opponent, lookupHand),
        deck: R.pipe(opponent, lookupDeck),
        structures: R.pipe(opponent, lookupStructures),
        grave: R.pipe(opponent, lookupGrave),
        creatures: R.pipe(opponent, lookupCreatures),
        courtyard: R.pipe(opponent, lookupCourtyard),
        town: R.pipe(opponent, lookupTown)
      }
    }
  }

  get check() {
    const isPhase = name =>
      this.props.game.state.currentPhase.name === name

    const isTurn = target => {
      const currentTurn = this.props.game.state.turn
      const currentPlayerIndex = this.props.game.currentPlayer.playerIndex

      if (target === 'self') {
        return currentTurn === currentPlayerIndex
      }
      if (target === 'opponent') {
        return currentTurn !== currentPlayerIndex
      }
    }

    const inLocation = (target, location, findId) =>
      this.lookup[target][location]().find(id => id === findId)

    const queueExists = () =>
      this.props.game.promptQueue[0]

    const isTargetable = id =>
      queueExists
      && this.props.game.promptQueue[0]
           .steps[this.props.game.promptQueue[0].currentStep]
           .targetables.find(target => target.id === id)

    return {
      isPhase,
      isTurn,
      inLocation,
      queueExists,
      isTargetable
    }
  }

  bindPrompts(data) {
    console.log('PROMPT UPDATE, YO!')
    console.log(data)
  }

  bindState() {
    this.gameActs.stateUpdate(engine.getState())
  }
}