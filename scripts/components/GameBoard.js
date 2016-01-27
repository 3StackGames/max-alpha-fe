import React, { Component, PropTypes } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'
import { phases } from '../utils'
import {
  Hand,
  Card,
  ResourceOrb,
  WorkerOrb,
  FaceDownCard,
  Town,
  Field,
  Castle,
  StructureDeck,
  Courtyard,
  MainDeck,
  Grave,
  ResourceIndicator,
  ZoomView
} from '.'

@autobind
export default class GameBoard extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.ui.playingCard && nextProps.ui.selectedCard !== nextProps.ui.playingCard) {
      this.props.uiActs.cancelDeclaration()
    }
  }

  render() {
    const { props } = this
    return (
      <div className='board-container'>
        <div className='opponent-container'>
          <div className='collections-container'>
            <MainDeck
              lookup={props.lookup}
              player='opponent' />
            <Grave
              lookup={props.lookup}
              player='opponent' />
            <StructureDeck 
              lookup={props.lookup}
              check={props.check}
              ui={props.ui}
              uiActs={props.uiActs}
              player='opponent' />
          </div>
          <Courtyard
            lookup={props.lookup}
            check={props.check}
            ui={props.ui}
            uiActs={props.uiActs}
            player='opponent' />
          <div className='playing-container'>
            <Hand
              lookup={props.lookup}
              check={props.check}
              ui={props.ui}
              uiActs={props.uiActs}
              game={props.game}
              pullAction={this.pullAction}
              player='opponent' />
            <Field
              lookup={props.lookup}
              check={props.check}
              ui={props.ui}
              uiActs={props.uiActs}
              game={props.game}
              smoothAttackAction={this.smoothAttackAction}
              smoothBlockAction={this.smoothBlockAction}
              player='opponent' />
          </div>
          <div className='resources-container'>
            <Town
              lookup={props.lookup}
              check={props.check}
              ui={props.ui}
              uiActs={props.uiActs}
              game={props.game}
              assignAction={this.assignAction}
              player='opponent' />
            <ResourceIndicator
              lookup={props.lookup}
              player='opponent' />
          </div>
        </div>
        <div className='actions-container'>
          <ZoomView
            ui={this.props.ui}
            lookup={this.props.lookup} />
          <div className='phase-container'>
            <div className='currentphase-group group'>
              {this.props.game.state.currentPhase.type}
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
              lookup={props.lookup}
              check={props.check}
              ui={props.ui}
              uiActs={props.uiActs}
              game={props.game}
              smoothAttackAction={this.smoothAttackAction}
              player='opponent' />
            <Castle
              lookup={props.lookup}
              check={props.check}
              ui={props.ui}
              uiActs={props.uiActs}
              game={props.game}
              smoothAttackAction={this.smoothAttackAction}
              player='self' />
          </div>
        </div>
        <div className='self-container'>
          <div className='collections-container'>
            <StructureDeck
              lookup={props.lookup}
              check={props.check}
              ui={props.ui}
              uiActs={props.uiActs}
              player='self' />
            <Grave
              lookup={props.lookup}
              player='self' />
            <MainDeck
              lookup={props.lookup}
              player='self' />
          </div>
          <Courtyard
            lookup={props.lookup}
            check={props.check}
            ui={props.ui}
            uiActs={props.uiActs}
            player='self' />
          <div className='playing-container'>
            <Field
              lookup={props.lookup}
              check={props.check}
              ui={props.ui}
              uiActs={props.uiActs}
              game={props.game}
              smoothAttackAction={this.smoothAttackAction}
              player='self' />
            <Hand
              lookup={props.lookup}
              check={props.check}
              ui={props.ui}
              uiActs={props.uiActs}
              game={props.game}
              pullAction={this.pullAction}
              player='self' />
          </div>
          <div className='resources-container'>
            <ResourceIndicator
              lookup={props.lookup}
              player='self' />
            <Town
              lookup={props.lookup}
              check={props.check}
              ui={props.ui}
              uiActs={props.uiActs}
              game={props.game}
              assignAction={this.assignAction}
              player='self' />
          </div>
        </div>
      </div>
    )
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
    const card = this.props.lookup.card(zoomedCard)
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
    const { check, lookup, ui, uiActs } = this.props
    const { selectedCard, playingCard } = ui

    if (
      !selectedCard
      && !playingCard
      && !check.promptExists
    ) {
      return
    }

    if (check.promptExists) {

      const selectOption = index => {
        this.choosePromptAction(check.currentPromptStep.choices[index].id)
      }

      if (this.props.game.state.prompt.type === 'ChoosePrompt') {
        return [
          <div key={0} className='prompt-item'><button onClick={() => selectOption(0)}>{check.currentPromptStep.choices[0].name}</button></div>,
          <div key={1} className='prompt-item'><button onClick={() => selectOption(1)}>{check.currentPromptStep.choices[1].name}</button></div>
        ]
      }
      return [
        <div key={0} className='prompt-item'>{selectedCard ? 'Selected: ' + lookup.card(selectedCard).name : 'Select a target'}</div>,
        <div key={1} className='prompt-item'><button onClick={this.singleTargetPromptAction}>TARGET</button></div>
      ]
    }

    if (playingCard) {
      const colorResources = lookup.self.player().resources.colors
      return [
        <div key={0} className='prompt-item'>
          Cost: (1)(2)(3)
        </div>,
        <div key={1} className='prompt-item'>
          {
            Object.keys(colorResources)
              .filter(color => colorResources[color] > 0)
              .map(color => (
                <button onClick={() => uiActs.assignCost(color, (ui.cost.colors[color]) + 1)}>{color}: {ui.cost.colors[color]}</button>
              ))
          }
        </div>,
        <div key={2} className='prompt-item'>
          <button onClick={this.playAction}>PLAY</button>
        </div>
      ]
    }

    const { hasAssignedOrPulled } = lookup.self.player

    if (check.inLocation('self', 'hand', selectedCard)) {
      if (!hasAssignedOrPulled) {
        return this.buildPromptButtons(this.playButton, this.assignButton)
      }

      return this.buildPromptButtons(this.playButton)
    }

    if (check.inLocation('self', 'structures', selectedCard)) {
      return this.buildPromptButtons(this.playButton)
    }

    if (check.inLocation('self', 'creatures', selectedCard)) {
      if (check.isPhase(phases.ATTACK) && check.isTurn('self')) {
        return this.buildPromptButtons(this.attackButton)
      }

      if (check.isPhase(phases.BLOCK) && this.props.check.isTurn('opponent')) {
        return this.buildPromptButtons(this.blockButton)
      }
    }

    if (
      check.inLocation('self', 'town', selectedCard) 
      && !hasAssignedOrPulled
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

  get endPhaseNode() {
    if (this.props.check.isTurn('self')) {
      if (this.props.check.isPhase(phases.MAIN)) {
        if (this.props.game.state.combatEnded) {
          return <button onClick={this.finishPhaseAction}>END TURN</button>
        }
        return [
          <button key={0} onClick={this.finishPhaseAction}>Move to Combat</button>,
          <button key={1} onClick={this.endTurnWithoutCombatAction}>END TURN</button>
        ]
      }

      if (this.props.check.isPhase(phases.ATTACK)) {
        return [
          <button key={0} onClick={this.finishPhaseAction}>Launch Attack</button>
        ]
      }
    }

    if (this.props.check.isTurn('opponent')) {
      if (this.props.check.isPhase(phases.BLOCK)) {
        return (
          <button
            onClick={this.finishPhaseAction}>
            Finish Blocking
          </button>
        )
      }
    }
  }

  get currentPlayerId() {
    return this.props.game.currentPlayer.playerId
  }

  UIPlayAction() {
    this.props.uiActs.declarePlayCard(this.props.ui.selectedCard)
  }

  UIAssignCostAction(color, value) {
    this.props.uiActs.assignCost(color, value)
  }

  UIAttackAction() {
    this.declareAttackAction()
    this.props.uiActs.selectCard(null)
  }

  UIBlockAction() {
    this.declareBlockAction()
    this.props.uiActs.selectCard(null)
  }

  assignAction() {
    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        playerId: this.currentPlayerId,
        type: 'Assign Card',
        cardId: this.props.ui.selectedCard
      }
    })
    this.props.uiActs.selectCard(null)
  }

  playAction() {
    const { selectedCard } = this.props.ui
    let playType

    if (this.props.check.inLocation('self', 'hand', selectedCard)) {
      playType = 'Play Card'
    }

    if (this.props.check.inLocation('self', 'structures', selectedCard)) {
      playType = 'Build Structure'
    }

    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: playType,
        playerId: this.currentPlayerId,
        cardId: selectedCard,
        cost: this.props.ui.cost
      }
    })
    this.props.uiActs.selectCard(null)
    this.props.uiActs.cancelDeclaration()
  }

  pullAction() {
    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Pull Card',
        playerId: this.currentPlayerId,
        cardId: this.props.ui.selectedCard
      }
    })
    this.props.uiActs.selectCard(null)
  }

  declareAttackAction() {
    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Declare Attacker',
        playerId: this.currentPlayerId,
        cardId: this.props.ui.selectedCard
      }
    })
  }

  declareBlockAction() {
    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Declare Blocker',
        playerId: this.currentPlayerId,
        cardId: this.props.ui.selectedCard
      }
    })
  }

  singleTargetPromptAction(id) {
    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Prompt Target',
        playerId: this.currentPlayerId,
        cardId: id || this.props.ui.selectedCard
      }
    })
    this.props.uiActs.selectCard(null)
  }

  choosePromptAction(id) {
    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Choose Prompt Target',
        playerId: this.currentPlayerId,
        cardId: id || this.props.ui.selectedCard
      }
    })
    this.props.uiActs.selectCard(null)
  }

  finishPhaseAction() {
    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'Finish Phase',
        playerId: this.currentPlayerId
      }
    })
    this.props.uiActs.selectCard(null)
  }

  endTurnWithoutCombatAction() {
    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
      gameCode: this.props.game.gameCode,
      action: {
        type: 'End Turn Without Combat',
        playerId: this.currentPlayerId
      }
    })
    this.props.uiActs.selectCard(null)
  }

  smoothAttackAction(attackerId, targetId) {
    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
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
    this.props.engine.send({
      eventType: this.props.engine.types.GAME_ACTION,
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
    const playerResources = this.props.lookup.self.player().resources.colors
    const costButtonNodes = Object.keys(playerResources)
      .filter(color => playerResources[color] > 0)
      .map(color => {
        const colorValue = this.props.ui.cost.colors[color] || 0
        return (
          <div key={color}>
            <button
              onClick={() => this.props.uiActs.assignCost(color, colorValue + 1)}>
              {color}: {colorValue}
            </button>
          </div>
        )
      })

    const card = this.props.lookup.card(cardId)
    const cardCost = card.currentCost.colors
    const costNodes = Object.keys(cardCost)
      .filter(color => cardCost[color] > 0)
      .map(color => (
        <span key={color}>{color}: {cardCost[color]} </span>
      ))
    const playCard = () => {
      this.playAction()
      this.props.uiActs.declarePlayCard(null)
      this.props.uiActs.selectCard(null)
    }

    return (
      <div>
        <div>{costNodes}</div>
        {costButtonNodes}
        <button onClick={() => this.props.uiActs.declarePlayCard(null)}>Cancel</button>
        <button onClick={() => playCard()}>PLAY</button>
      </div>
    )
  }

  get attackingActionUIViewNode() {
    const { selectedCard } = this.props.ui
    if (selectedCard) {
      return (
        <div>
          <p>Targeting: {this.props.lookup.card(selectedCard).name}</p>
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
          <p>Targeting: {this.props.lookup.card(selectedCard).name}</p>
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
      <pre>{JSON.stringify(this.props.lookup.card(this.props.ui.zoomedCard), null, 2)}</pre>
    )
  }

  get phaseActionNode() {
    let buttonText = ''
    const phaseName = this.props.game.state.currentPhase.type
    switch (phaseName) {
      case phases.MAIN:
        buttonText = this.props.game.state.combatEnded
          ? 'END TURN'
          : 'DECLARE ATTACKERS'
        break
      case phases.ATTACK:
        buttonText = 'PREPARE BLOCKERS'
        break
      case phases.BLOCK:
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
}
