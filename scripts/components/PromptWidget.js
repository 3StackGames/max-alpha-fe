import React, { Component, PropTypes } from 'react'
import { phases, actions } from '../utils'
import {
  PlayCostWidget,
  SelectCostWidget
} from '.'

export default class PromptWidget extends Component {
  static propTypes = {
    check: PropTypes.object,
    lookup: PropTypes.object,
    ui: PropTypes.object,
    uiActs: PropTypes.object,
    assignAction: PropTypes.func,
    pullAction: PropTypes.func,
    playAction: PropTypes.func,
    choosePromptAction: PropTypes.func,
    singleTargetPromptAction: PropTypes.func,
    activateAbilityAction: PropTypes.func,
    UIPlayAction: PropTypes.func,
    UIAttackAction: PropTypes.func,
    UIBlockAction: PropTypes.func,
  };

  render() {
    return <div className="PromptWidget">
      {this.promptItem}
    </div>
  }

  get promptItem() {
    const { check, lookup, ui, uiActs } = this.props
    const { selectedCard, playingCard, selectedAbility } = ui

    if (
      !selectedCard
      && !selectedAbility
      && !playingCard
      && !check.promptExists
    ) {
      return
    }

    if (check.promptExists) {
      const selectOption = index => {
        this.props.choosePromptAction(check.currentPrompt.options[index].id)
      }

      if (check.currentPrompt.type === 'CHOOSE') {
        return [
          <div key={0} className='prompt-item'><button onClick={() => selectOption(0)}>{check.currentPrompt.options[0].name}</button></div>,
          <div key={1} className='prompt-item'><button onClick={() => selectOption(1)}>{check.currentPrompt.options[1].name}</button></div>
        ]
      }
      return [
        <div key={0} className='prompt-item'>{selectedCard ? 'Selected: ' + lookup.card(selectedCard).name : 'Select a target'}</div>,
        <div key={1} className='prompt-item'><button onClick={() => this.props.singleTargetPromptAction()}>TARGET</button></div>
      ]
    }

    if (playingCard) {
      const colorResources = lookup.self.player().resources.colors
      const { currentCost } = lookup.card(playingCard)

      return [
        <div key={0} className='prompt-item'>
          <PlayCostWidget
            cost={currentCost}
            paidCost={ui.cost} />
        </div>,
        <div key={1} className='prompt-item'>
          <SelectCostWidget
            cost={currentCost}
            paidCost={ui.cost}
            colorResources={colorResources}
            assignCost={uiActs.assignCost} />
        </div>,
        <div key={2} className='prompt-item'>
          <button onClick={this.props.playAction}>PLAY</button>
        </div>
      ]
    }

    if (selectedAbility) {
      const colorResources = lookup.self.player().resources.colors
      const currentCost = selectedAbility.cost
      return [
        <div key={0} className='prompt-item'>
          <PlayCostWidget
            cost={currentCost}
            paidCost={ui.cost} />
        </div>,
        <div key={1} className='prompt-item'>
          <SelectCostWidget
            cost={currentCost}
            paidCost={ui.cost}
            colorResources={colorResources}
            assignCost={uiActs.assignCost} />
        </div>,
        <div key={2} className='prompt-item'>
          <button onClick={this.props.activateAbilityAction}>ACTIVATE</button>
        </div>
      ]
    }

    if (
      selectedCard
      && check.isPhase(phases.MAIN)
      && check.inLocation('self', 'creatures', selectedCard)
         || check.inLocation('self', 'courtyard', selectedCard)
    ) {
      const card = lookup.card(selectedCard)
      return card.abilities.map(ab => (
        <div
          key={ab.id}
          className='prompt-item'
          onClick={() => uiActs.selectAbility({
            ...ab,
            cardId: card.id
          })}>
          <button>{ab.text}</button>
        </div>
      ))
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
    return <button onClick={this.props.UIPlayAction}>Play</button>
  }

  get assignButton() {
    return <button onClick={this.props.assignAction}>Assign</button>
  }

  get attackButton() {
    return <button onClick={this.props.UIAttackAction}>Attack</button>
  }

  get blockButton() {
    return <button onClick={this.props.UIBlockAction}>Block</button>
  }

  get pullButton() {
    return <button onClick={this.props.pullAction}>Pull</button>
  }
}
