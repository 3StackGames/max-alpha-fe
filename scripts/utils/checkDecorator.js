import React, { Component } from 'react'

export function checkDecorator(ComposedComponent) {

  // if (!this.props.lookup) {
  //   throw '`@check` depends on `@lookup`. Compose your component with `@lookup` before using `@check`'
  // }

  ComposedComponent.prototype.check = function check() {
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

    const inLocation = (target, location, findId) => {
      console.log(this)
      return this.props.lookup()[target][location]().find(id => id === findId)
    }

    return {
      isPhase,
      isTurn,
      inLocation
    }
  }

  return ComposedComponent
}