const SELECT_CARD = 'max-alpha/ui/SELECT_CARD'
const ZOOM_CARD = 'max-alpha/ui/ZOOM_CARD'

const initialState = {
  selectedCard: null,
  zoomedCard: null
}
const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SELECT_CARD:
      return {
        ...state,
        selectedCard: payload
      }
    case ZOOM_CARD:
      return {
        ...state,
        zoomedCard: payload
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

export default reducer