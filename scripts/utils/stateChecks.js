import stateLookups from './stateLookups'

const isPhase = game => name =>
  game.state.currentPhase.name === name

const isTurn = game => target => {
  const currentTurn = game.state.turn
  const currentPlayerIndex = game.currentPlayer.playerIndex

  if (target === 'self') {
    return currentTurn === currentPlayerIndex
  }
  if (target === 'opponent') {
    return currentTurn !== currentPlayerIndex
  }
}

const inLocation = game => (target, location, findId) =>
  stateLookups(game)[target][location]().find(id => id === findId)

const queueExists = game => () =>
  game.promptQueue[0]

const isTargetable = game => id =>
  queueExists(game)
  && game.promptQueue[0]
       .steps[game.promptQueue[0].currentStep]
       .targetables.find(target => target.id === id)

const stateChecks = game => ({
  isPhase: isPhase(game),
  isTurn: isTurn(game),
  inLocation: inLocation(game),
  queueExists: queueExists(game),
  isTargetable: isTargetable(game)
})

export default stateChecks