const STATE_UPDATE = 'max-alpha/gameState/STATE_UPDATE'

const initialState = {}
const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case STATE_UPDATE:
      return payload
    default:
      return state
  }
}

export const stateUpdate = gameState => {
  return {
    type: STATE_UPDATE,
    payload: gameState
  }
}

export default reducer