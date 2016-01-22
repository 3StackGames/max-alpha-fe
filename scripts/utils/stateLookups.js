import R from 'ramda'

const lookupCard = game => id => {
  const card = game.cardList[id]
  return card.value || { id }
}

const self = game =>
  game.state.players[game.currentPlayer.playerIndex]

const opponent = game =>
  game.state.players[game.currentPlayer.playerIndex === 0 ? 1 : 0]

const lookupHand = target => () =>
  target.hand.cardIds

const lookupDeck = target => () =>
  target.mainDeck.cardIds

const lookupStructures = target => () =>
  target.structureDeck.cardIds

const lookupGrave = target => () =>
  target.graveyard.cardIds

const lookupCreatures = target => () =>
  target.field.cardIds

const lookupCourtyard = target => () =>
  target.courtyard.cardIds

const lookupTown = target => () =>
  target.town.cardIds

const stateLookups = game => ({
  card: lookupCard(game),
  self: {
    player: () => self(game),
    hand: R.pipe(self, lookupHand)(game),
    deck: R.pipe(self, lookupDeck)(game),
    structures: R.pipe(self, lookupStructures)(game),
    grave: R.pipe(self, lookupGrave)(game),
    creatures: R.pipe(self, lookupCreatures)(game),
    courtyard: R.pipe(self, lookupCourtyard)(game),
    town: R.pipe(self, lookupTown)(game)
  },
  opponent: {
    player: () => opponent(game),
    hand: R.pipe(opponent, lookupHand)(game),
    deck: R.pipe(opponent, lookupDeck)(game),
    structures: R.pipe(opponent, lookupStructures)(game),
    grave: R.pipe(opponent, lookupGrave)(game),
    creatures: R.pipe(opponent, lookupCreatures)(game),
    courtyard: R.pipe(opponent, lookupCourtyard)(game),
    town: R.pipe(opponent, lookupTown)(game)
  }
})

export default stateLookups