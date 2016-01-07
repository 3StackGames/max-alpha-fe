import R from 'ramda'

export const bindStateDecorator = engine => component => {
  const cwm = component.prototype.componentWillMount
  const cwu = component.prototype.componentWillUnmount

  component.prototype.componentWillMount = function() {
    engine.addStateListener(this.bindState)
    if (cwm) cwm.call(this)
  }

  component.prototype.componentWillUnmount = function() {
    engine.removeStateListener(this.bindState)
    if (cwu) cwu.call(this)
  }
}

export const keys = {
      BLACK: 'BLACK',
       BLUE: 'BLUE',
  COLORLESS: 'COLORLESS',
      GREEN: 'GREEN',
        RED: 'RED',
      WHITE: 'WHITE',
     YELLOW: 'YELLOW'
}

function lookupCard(game, id) {
  const card = game.cardList[id]
  return card.value || { id }
}

function self(game) {
  return game.state.players
    .find(player => player.playerId === game.currentPlayer)
}

function opponent(game) {
  return game.state.players
    .find(player => player.playerId !== game.currentPlayer)
}

function lookupHand(target) {
  return target.hand.cardIds
}

function selfHand(game) {
  return R.pipe(self, lookupHand)(game)
}

function opponentHand(game) {
  return R.pipe(opponent, lookupHand)(game)
}

function lookupDeck(target) {
  return target.deck.cardIds
}

function selfDeck(game) {
  return R.pipe(self, lookupDeck)(game)
}

function opponentDeck(game) {
  return R.pipe(opponent, lookupDeck)(game)
}

function lookupStructures(target) {
  return target.deck.buildables.cardIds
}

function selfStructures(game) { 
  return R.pipe(self, lookupStructures)(game)
}

function opponentStructures(game) {
  return R.pipe(opponent, lookupStructures)(game)
}

function lookupGrave(target) {
  return target.grave.cardIds
}

function selfGrave(game) {
  return R.pipe(self, lookupGrave)(game)
}

function opponentGrave(game) {
  return R.pipe(opponent, lookupGrave)(game)
}

function lookupField(target) {
  return target.field.cardIds
}

function selfField(game) {
  return R.pipe(self, lookupField)(game)
}

function opponentField(game) {
  return R.pipe(opponent, lookupField)(game)
}

function lookupCourtyard(target) {
  return target.courtyard.cardIds
}

function selfCourtyard(game) {
  return R.pipe(self, lookupCourtyard)(game)
}

function opponentCourtyard(game) {
  return R.pipe(opponent, lookupCourtyard)(game)
}

function lookupTown(target) {
  return target.town.cardIds
}

function selfTown(game) {
  return R.pipe(self, lookupTown)(game)
}

function opponentTown(game) {
  return R.pipe(opponent, lookupTown)(game)
}

const stateLookups = {
  card: lookupCard,
  self: {
    player: self,
    hand: selfHand,
    deck: selfDeck,
    structures: selfStructures,
    grave: selfGrave,
    field: selfField,
    courtyard: selfCourtyard,
    town: selfTown
  },
  opponent: {
    player: opponent,
    hand: opponentHand,
    deck: opponentDeck,
    structures: opponentStructures,
    grave: opponentGrave,
    field: opponentField,
    courtyard: opponentCourtyard,
    town: opponentTown
  }
}

const bindFnObject = (obj, context, game) => {
  return Object.keys(obj)
    .reduce((acc, key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        acc[key] = bindFnObject(obj[key], context, game)
      } else {
        acc[key] = obj[key].bind(context, game)
      }
      return acc
    }, {})
}

export const bindStateLookups = (context, game) => {
  return bindFnObject(stateLookups, context, game)
}
