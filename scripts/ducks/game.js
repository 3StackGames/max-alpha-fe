const STATE_UPDATE = 'max-alpha/game/STATE_UPDATE'
const SET_PLAYER = 'max-alpha/game/SET_PLAYER'
const SET_GAME_CODE = 'max-alpha/game/SET_GAME_CODE'
const PROMPT_UPDATE = 'max-alpha/game/PROMPT_UPDATE'

const initialState = {
  currentPlayer: null,
  gameCode: null,
  state: {},
  cardList: []
}
const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case STATE_UPDATE:
      return {
        ...state,
        ...payload
      }
    case PROMPT_UPDATE:
      return {
        ...state,
        state: {
          ...state.state,
          prompt: payload
        }
      }
    case SET_GAME_CODE:
      return {
        ...state,
        gameCode: payload
      }
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

export const promptUpdate = prompt => {
  return {
    type: PROMPT_UPDATE,
    payload: prompt
  }
}

export const setPlayer = id => {
  return {
    type: SET_PLAYER,
    payload: id
  }
}

export const setGameCode = code => {
  return {
    type: SET_GAME_CODE,
    payload: code
  }
}

export default reducer
