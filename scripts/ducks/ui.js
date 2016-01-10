import titleCase from 'title-case'

const SELECT_CARD = 'max-alpha/ui/SELECT_CARD'
const ZOOM_CARD = 'max-alpha/ui/ZOOM_CARD'
const DECLARE_PLAY_CARD = 'max-alpha/ui/DECLARE_PLAY_CARD'
const ASSIGN_COST = 'max-alpha/ui/ASSIGN_COST'
const DECLARE_ATTACK_CARD = 'max-alpha/ui/DECLARE_ATTACK_CARD'
const DECLARE_BLOCK_CARD = 'max-alpha/ui/DECLARE_BLOCK_CARD'
const ASSIGN_TARGET = 'max-alpha/ui/ASSIGN_TARGET'
const CANCEL_DECLARATION = 'max-alpha/ui/CANCEL_DECLARATION'

const initialColors = {
  COLORLESS: 0,
  RED: 0,
  BLUE: 0,
  WHITE: 0,
  BLACK: 0,
  GREEN: 0,
  YELLOW: 0
}

const initialState = {
  selectedCard: null,
  zoomedCard: null,
  playingCard: null,
  attackingCard: null,
  blockingCard: null,
  targetCard: null,
  cost: {
    colors: initialColors
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
            colors: initialColors
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
    case DECLARE_BLOCK_CARD:
      if (!payload) {
        return {
          ...state,
          blockingCard: null,
          targetCard: null
        }
      }
      return {
        ...state,
        blockingCard: payload
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
          colors: initialColors
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
      color: color
    }
  }
}

export const declareAttackCard = id => {
  return {
    type: DECLARE_ATTACK_CARD,
    payload: id
  }
}

export const declareBlockCard = id => {
  return {
    type: DECLARE_BLOCK_CARD,
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