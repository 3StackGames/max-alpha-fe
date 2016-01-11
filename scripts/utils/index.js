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

const lookupCard = (game, id) => {
  const card = game.cardList[id]
  return card.value || { id }
}

const self = (game) =>
  game.state.players[game.currentPlayer.playerIndex]

const opponent = (game) =>
  game.state.players[game.currentPlayer.playerIndex === 0 ? 1 : 0]

const lookupHand = (target) =>
  target.hand.cardIds

const selfHand = (game) =>
  R.pipe(self, lookupHand)(game)

const opponentHand = (game) =>
  R.pipe(opponent, lookupHand)(game)

const lookupDeck = (target) =>
  target.deck.cardIds

const selfDeck = (game) =>
  R.pipe(self, lookupDeck)(game)

const opponentDeck = (game) =>
  R.pipe(opponent, lookupDeck)(game)

const lookupStructures = (target) =>
  target.deck.buildables.cardIds

const selfStructures = (game) =>
  R.pipe(self, lookupStructures)(game)

const opponentStructures = (game) =>
  R.pipe(opponent, lookupStructures)(game)

const lookupGrave = (target) =>
  target.grave.cardIds

const selfGrave = (game) =>
  R.pipe(self, lookupGrave)(game)

const opponentGrave = (game) =>
  R.pipe(opponent, lookupGrave)(game)

const lookupCreatures = (target) =>
  target.field.creatures.cardIds

const selfCreatures = (game) =>
  R.pipe(self, lookupCreatures)(game)

const opponentCreatures = (game) =>
  R.pipe(opponent, lookupCreatures)(game)

const lookupCourtyard = (target) =>
  target.courtyard.cardIds

const selfCourtyard = (game) =>
  R.pipe(self, lookupCourtyard)(game)

const opponentCourtyard = (game) =>
  R.pipe(opponent, lookupCourtyard)(game)

const lookupTown = (target) =>
  target.town.cardIds

const selfTown = (game) =>
  R.pipe(self, lookupTown)(game)

const opponentTown = (game) =>
  R.pipe(opponent, lookupTown)(game)


const stateLookups = {
  card: lookupCard,
  self: {
    player: self,
    hand: selfHand,
    deck: selfDeck,
    structures: selfStructures,
    grave: selfGrave,
    creatures: selfCreatures,
    courtyard: selfCourtyard,
    town: selfTown
  },
  opponent: {
    player: opponent,
    hand: opponentHand,
    deck: opponentDeck,
    structures: opponentStructures,
    grave: opponentGrave,
    creatures: opponentCreatures,
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
