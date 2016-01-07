import Engine from './socketEngine'

const config = {
  host: 'ws://localhost',
  port: 8080
}
const engine = Engine(config)
engine.addOnAllMessages(data => {
  if (data.eventType !== engine.types.STATE_UPDATE) {
    console.log(data)
  }
})

export default engine
