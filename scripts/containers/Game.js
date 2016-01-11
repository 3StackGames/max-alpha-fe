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
  WorkerOrb,
  FaceDownCard
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

    if (this.props.ui.playingCard && this.props.ui.selectedCard !== this.props.ui.playingCard) {
      this.uiActs.cancelDeclaration()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.ui.attackingCard
      && prevProps.ui.attackingCard !== this.props.ui.attackingCard
    ) {
      this.declareAttackAction()
    }

    if (
      this.props.ui.blockingCard
      && prevProps.ui.blockingCard !== this.props.ui.blockingCard
    ) {
      this.declareBlockCard()
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
            <div className='hand-container'>
              {this.handNodes('opponent')}
            </div>
            <div className='field-container'>
              {this.creatureNodes('opponent')}
            </div>
          </div>
          <div className='resources-container'>
            <div className='town-container'>
              <div className='town-body'>
                {this.townNodes('opponent')}
              </div>
              <div className='container-label'><span></span></div>
            </div>
            <div className='resource-indicator-container'>
              <div className='resource-indicator-body'>
                <div className='resource-row'>
                  {this.resourceNode('opponent', 'BLUE')}
                  {this.resourceNode('opponent', 'WHITE')}
                </div>
                <div className='resource-row'>
                  {this.resourceNode('opponent', 'RED')}
                  {this.resourceNode('opponent', 'COLORLESS')}
                  {this.resourceNode('opponent', 'GREEN')}
                </div>
                <div className='resource-row'>
                  {this.resourceNode('opponent', 'YELLOW')}
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
            {this.castleNode('opponent')}
            {this.castleNode('self')}
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
            <div className='field-container'>
              {this.creatureNodes('self')}
            </div>
            <div className='hand-container'>
              {this.handNodes('self')}
            </div>
          </div>
          <div className='resources-container'>
            <div className='resource-indicator-container'>
              <div className='resource-indicator-body'>
                <div className='resource-row'>
                  {this.resourceNode('self', 'BLUE')}
                  {this.resourceNode('self', 'WHITE')}
                </div>
                <div className='resource-row'>
                  {this.resourceNode('self', 'RED')}
                  {this.resourceNode('self', 'COLORLESS')}
                  {this.resourceNode('self', 'GREEN')}
                </div>
                <div className='resource-row'>
                  {this.resourceNode('self', 'YELLOW')}
                  {this.resourceNode('self', 'BLACK')}
                </div>
              </div>
            </div>
            <div className='town-container'>
              <div className='container-label'><span></span></div>
              <div className='town-body'>
                {this.townNodes('self')}
              </div>
            </div>
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
    const { promptQueue } = this.props.game.state

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

    if (this.inLocation('self', 'hand', selectedCard)) {
      return [
        <div key={0} className='prompt-item'><button onClick={this.UIPlayAction}>Play</button></div>,
        <div key={1} className='prompt-item'><button onClick={this.assignAction}>Assign</button></div>
      ]
    }

    if (this.inLocation('self', 'structures', selectedCard)) {
      return [
        <div key={0} className='prompt-item'><button onClick={this.UIPlayAction}>Play</button></div>
      ]
    }

    if (this.inLocation('self', 'creatures', selectedCard)) {
      if (this.isPhase('Attack Phase') && this.isTurn('self')) {
        return [
          <div key={0} className='prompt-item'><button onClick={this.UIAttackAction}>Attack</button></div>
        ]
      }

      if (this.isPhase('Block Phase') && this.isTurn('opponent')) {
        return [
          <div key={0} className='prompt-item'><button onClick={this.UIBlockAction}>Block</button></div>
        ]
      }
    }

    if (this.inLocation('self', 'town', selectedCard)) {
      return [
        <div key={0} className='prompt-item'><button onClick={this.pullAction}>Pull</button></div>
      ]
    }
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
    const town = this.lookup[target].town()
    return town.length === 0
      ? 'No workers'
      : town
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
        style={{ transform: `translateX(${ i * -0.25 }px)` }}
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
    if (this.isTurn('self')) {
      if (this.isPhase('Main Phase')) {
        if (this.props.game.state.combatEnded) {
          return <button onClick={this.finishPhaseAction}>END TURN</button>
        }
        return [
          <button key={0} onClick={this.finishPhaseAction}>Move to Combat</button>,
          <button key={1} onClick={this.endTurnWithoutCombatAction}>END TURN</button>
        ]
      }

      if (this.isPhase('Attack Phase')) {
        return [
          <button key={0} onClick={this.finishPhaseAction}>Launch Attack</button>
        ]
      }
    }

    if (this.isTurn('opponent')) {
      if (this.isPhase('Block Phase')) {
        return (
          <button
            onClick={this.finishPhaseAction}>
            Finish Blocking
          </button>
        )
      }
    }
  }

  isPhase(name) {
    return this.props.game.state.currentPhase.name === name
  }

  isTurn(target) {
    const currentTurn = this.props.game.state.turn
    const currentPlayerIndex = this.props.game.currentPlayer.playerIndex

    if (target === 'self') {
      return currentTurn === currentPlayerIndex
    }
    if (target === 'opponent') {
      return currentTurn !== currentPlayerIndex
    }
  }

  inLocation(target, location, findId) {
    return this.lookup[target][location]().find(id => id === findId)
  }

  get currentPromptStep() {
    if (this.props.game.state.promptQueue.length === 0) {
      return null
    }

    const promptHead = this.props.game.state.promptQueue[0]
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
    // if (this.isPhase('Main Phase')) {
    //   if (this.inLocation('self', 'courtyard', id)) {
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
    if (this.inLocation('self', 'courtyard', id)) {
      this.uiActs.zoomCard(id)
    }
  }

  handleStructureMouseOut(e, id) {
    if (this.inLocation('self', 'courtyard', id)) {
      this.uiActs.zoomCard(null)
    }
  }

  handleStructureDeckClick(e, id) {
    if (this.isPhase('Main Phase')) {
      if (this.inLocation('self', 'structures', id)) {
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
    if (this.inLocation('self', 'structures', id)) {
      this.uiActs.zoomCard(id)
    }
  }

  handleStructureDeckMouseOut(e, id) {
    if (this.inLocation('self', 'structures', id)) {
      this.uiActs.zoomCard(null)
    }
  }
  
  handleHandCardClick(e, id) {
    if (this.isPhase('Main Phase')) {
      if (this.inLocation('self', 'hand', id))
      this.uiActs.selectCard(id)
    }
  }

  handleHandCardMouseOver(e, id) {
    if (this.inLocation('self', 'hand', id)) {
      this.uiActs.zoomCard(id)
    }
  }

  handleHandCardMouseOut(e, id) {
    if (this.inLocation('self', 'hand', id)) {
      this.uiActs.zoomCard(null)
    }
  }

  handleFieldCardClick(e, id) {
    if (this.props.game.state.currentPhase.name === 'Attack Phase') {
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
        !this.props.game.state.promptQueue[0]
        // The card is on your field
        && this.lookup.self.creatures().find(fieldId => fieldId === id)
      ) {
        this.uiActs.selectCard(id)
      }
      else if (
        // There is a prompt queue
        this.props.game.state.promptQueue[0]
        // The card is targetable
        && this.props.game.state.promptQueue[0].steps[this.props.game.state.promptQueue[0].currentStep].targetables.find(target => target.id === id)
      ) {
        this.uiActs.selectCard(id)
      }
    }
  }

  handleFieldCardMouseOver(e, id) {
    this.uiActs.zoomCard(id)
  }

  handleFieldCardMouseOut(e, id) {
    this.uiActs.zoomCard(null)
  }

  handleWorkerClick(e, id) {
    if (this.props.game.state.currentPhase.name === 'Main Phase') {
      this.uiActs.selectCard(id)
    }
  }

  handleWorkerMouseOver(e, id) {
    this.uiActs.zoomCard(id)
  }

  handleWorkerMouseOut(e, id) {
    this.uiActs.zoomCard(null)
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

  UIBlockAction() {
    this.uiActs.declareBlockCard(this.props.ui.selectedCard)
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

    if (this.inLocation('self', 'hand', selectedCard)) {
      playType = 'Play Card'
    }

    if (this.inLocation('self', 'structures', selectedCard)) {
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
        cardId: this.props.ui.attackingCard
      }
    })
    this.uiActs.declareAttackCard(null)
  }

  declareBlockCard() {
    engine.send({
      eventType: engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Declare Blocker',
        playerId: this.currentPlayerId,
        cardId: this.props.ui.blockingCard
      }
    })
    this.uiActs.declareBlockCard(null)
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

  bindState() {
    this.gameActs.stateUpdate(engine.getState())
  }
}