import stateLookups from './stateLookups'

const isPhase = game => name =>
  game.state.currentPhase.type === name

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

const promptExists = game =>
  game.state.prompt

const currentPrompt = game =>
  game.state.prompt

const isTargetable = game => id =>
  promptExists(game)
  && game.state.prompt
       .targetableIds.find(targetId => targetId === id)

const stateChecks = game => ({
  isPhase: isPhase(game),
  isTurn: isTurn(game),
  inLocation: inLocation(game),
  promptExists: promptExists(game),
  currentPrompt: currentPrompt(game),
  isTargetable: isTargetable(game)
})

export default stateChecks
