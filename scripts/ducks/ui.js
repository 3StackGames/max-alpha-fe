import titleCase from 'title-case'

const SELECT_CARD = 'max-alpha/ui/SELECT_CARD'
const ZOOM_CARD = 'max-alpha/ui/ZOOM_CARD'
const DECLARE_PLAY_CARD = 'max-alpha/ui/DECLARE_PLAY_CARD'
const ASSIGN_COST = 'max-alpha/ui/ASSIGN_COST'
const DECLARE_ATTACK_CARD = 'max-alpha/ui/DECLARE_ATTACK_CARD'
const ASSIGN_TARGET = 'max-alpha/ui/ASSIGN_TARGET'
const CANCEL_DECLARATION = 'max-alpha/ui/CANCEL_DECLARATION'

const initialState = {
  selectedCard: null,
  zoomedCard: null,
  playingCard: null,
  attackingCard: null,
  targetCard: null,
  cost: {
    colors: {}
  }
}
const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SELECT_CARD:
      return {
        ...state,
        selectedCard: state.selectedCard === payload ? null : payload
      }
    case ZOOM_CARD:
      return {
        ...state,
        zoomedCard: payload
      }
    case DECLARE_PLAY_CARD:
      if (!payload) {
        return {
          ...state,
          playingCard: null,
          cost: {
            colors: {}
          }
        }
      }
      return {
        ...state,
        playingCard: payload
      }
    case DECLARE_ATTACK_CARD:
      if (!payload) {
        return {
          ...state,
          attackingCard: null,
          targetCard: null
        }
      }
      return {
        ...state,
        attackingCard: payload
      }
    case ASSIGN_COST:
      return {
        ...state,
        cost: {
          ...state.cost,
          colors: {
            ...state.cost.colors,
            [payload.color]: payload.value
          }
        }
      }
    case ASSIGN_TARGET:
      return {
        ...state,
        targetCard: payload
      }
    case CANCEL_DECLARATION:
      return {
        ...state,
        playingCard: null,
        attackingCard: null,
        cost: {
          colors: {}
        }
      }
    default:
      return state
  }
}

export const selectCard = id => {
  return {
    type: SELECT_CARD,
    payload: id
  }
}

export const zoomCard = id => {
  return {
    type: ZOOM_CARD,
    payload: id
  }
}

export const declarePlayCard = id => {
  return {
    type: DECLARE_PLAY_CARD,
    payload: id
  }
}

export const assignCost = (color, value) => {
  return {
    type: ASSIGN_COST,
    payload: {
      value,
      color: titleCase(color)
    }
  }
}

export const declareAttackCard = id => {
  return {
    type: DECLARE_ATTACK_CARD,
    payload: id
  }
}

export const assignTarget = id => {
  return {
    type: ASSIGN_TARGET,
    payload: id
  }
}

export const cancelDeclaration = () => {
  return {
    type: CANCEL_DECLARATION
  }
}

export default reducer