import StateEngine from './state-engine'
import { EventEmitter } from 'events'
import { clientTypes, serverTypes, internalTypes } from './constants'

const SocketEngine = ({ host, port }) => {
  const ws = new WebSocket(`${host}:${port}`)
  let stateEngine = StateEngine()
  const wsEmitter = new EventEmitter

  ws.onopen = () => {
    wsEmitter.emit(internalTypes.CONNECTED)
    ws.onmessage = mapMessageToEvent
    wsEmitter.on(serverTypes.STATE_UPDATE, handleStateUpdate)
  }

  const emitToMiddleware = data => {
    wsEmitter.emit(internalTypes.ANY_MESSAGE, data)
  }

  const mapMessageToEvent = event => {
    const data = JSON.parse(event.data)
    const emitted = wsEmitter.emit(data.eventType, data)
    emitToMiddleware(data)
  }

  // Default state update handler to enable state engine to emit a change event
  const handleStateUpdate = data => {
    const { state, cardList, currentPlayer } = data
    stateEngine.setState({ state, cardList, currentPlayer })
  }

  const addOnAllMessages = fn => {
    wsEmitter.on(internalTypes.ANY_MESSAGE, fn)
  }

  const removeOnAllMessages = fn => {
    wsEmitter.removeListener(internalTypes.ANY_MESSAGE, fn)
  }

  const addOnConnected = fn => {
    wsEmitter.on(internalTypes.CONNECTED, fn)
  }

  const removeOnConnected = fn => {
    wsEmitter.on(internalTypes.CONNECTED, fn)
  }

  const addOnGameFound = fn => {
    wsEmitter.on(serverTypes.GAME_FOUND, fn)
  }

  const removeOnGameFound = fn => {
    wsEmitter.removeListener(serverTypes.GAME_FOUND, fn)
  }

  const addOnServerMessage = fn => {
    wsEmitter.on(serverTypes.SERVER_MESSAGE, fn)
  }

  const removeOnServerMessage = fn => {
    wsEmitter.removeListener(serverTypes.SERVER_MESSAGE, fn)
  }

  const addOnError = fn => {
    wsEmitter.on(serverTypes.ERROR, fn)
  }

  const removeOnError = fn => {
    wsEmitter.removeListener(serverTypes.ERROR, fn)
  }

  const addOnStateUpdate = fn => {
    wsEmitter.on(serverTypes.STATE_UPDATE, fn)
  }

  const removeOnStateUpdate = fn => {
    wsEmitter.removeListener(serverTypes.STATE_UPDATE, fn)
  }

  const send = data => {
    ws.send(JSON.stringify(data))
    emitToMiddleware(data)
  }

  return Object.assign(stateEngine, {
    ws,
    send,
    addOnAllMessages,
    removeOnAllMessages,
    addOnConnected,
    removeOnConnected,
    addOnGameFound,
    removeOnGameFound,
    addOnError,
    removeOnError,
    addOnServerMessage,
    removeOnServerMessage,
    addOnStateUpdate,
    removeOnStateUpdate,
    types: {
      ...clientTypes,
      ...serverTypes,
      ...internalTypes
    }
  })
}

export default SocketEngine
