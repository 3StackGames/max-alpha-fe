import Engine from './socketEngine'

const config = {
  host: 'ws://localhost',
  port: 8080
}
const engine = Engine(config)
engine.addOnAllMessages(data => console.log(data))

export default engine
