import React, { Component } from 'react'
import { connect } from 'react-redux'
import { stateLookups, stateChecks, phases } from '../utils'

@connect(state => ({
  game: state.game
}))
export default class Canvas extends Component {
  componentDidMount() {
    document.addEventListener('resize', this.resizeCanvas)

    this.canvasEl = document.querySelector('canvas')
    this.ctx = this.canvasEl.getContext('2d')
    this.resizeCanvas()
  }

  componentWillUnmount() {
    document.removeEventListener('resize', this.resizeCanvas)
  }

  resizeCanvas() {
    this.canvasEl.width = window.innerWidth
    this.canvasEl.height = window.innerHeight
  }

  componentDidUpdate() {
    if (this.check.isPhase(phases.MAIN)) {
      this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)
      return
    }

    const attackingPlayer = this.check.isTurn('self') ? 'self' : 'opponent'
    const blockingPlayer = this.check.isTurn('self') ? 'opponent' : 'self'

    const attackerFieldCreatures =
      this.lookup[attackingPlayer].creatures()
      .map(id => this.lookup.card(id))

    const blockerFieldCreatures =
      this.lookup[blockingPlayer].creatures()
      .map(id => this.lookup.card(id))

    // TODO: attackTarget should just be an id, not the whole object
    const attackDrawCoordsList = attackerFieldCreatures
      .filter(creature => creature.attackTarget)
      .map(attackingCreature => {
        return [attackingCreature.id, attackingCreature.attackTarget.id]
      })
      .map(([attackerId, targetId]) => {
        function getCenterCoords(id) {
          const el = document.querySelector(`[data-card-id="${id}"]`)
          const elRect = el.getBoundingClientRect()
          const xCoord = elRect.left + elRect.width / 2
          const yCoord = elRect.top + elRect.height / 2
          return [xCoord, yCoord]
        }

        return [getCenterCoords(attackerId), getCenterCoords(targetId)]
      })

    const blockDrawCoordsList = blockerFieldCreatures
      .filter(creature => creature.blockTargetId)
      .map(blockingCreature => {
        return [blockingCreature.id, blockingCreature.blockTargetId]
      })
      .map(([blockerId, targetId]) => {
        function getCenterCoords(id) {
          const el = document.querySelector(`[data-card-id="${id}"]`)
          const elRect = el.getBoundingClientRect()
          const xCoord = elRect.left + elRect.width / 2
          const yCoord = elRect.top + elRect.height / 2
          return [xCoord, yCoord]
        }

        return [getCenterCoords(blockerId), getCenterCoords(targetId)]
      })

    this.ctx.beginPath()
    attackDrawCoordsList.forEach(([attacker, target]) => {
      this.ctx.moveTo(attacker[0], attacker[1])
      this.ctx.lineTo(target[0], target[1])
      this.ctx.strokeStyle = 'red'
      this.ctx.stroke()

      console.log(`attack start point: (${attacker[0]}, ${attacker[1]})`)
      console.log(`attack end point: (${target[0]}, ${target[1]})`)
    })
    this.ctx.beginPath()
    blockDrawCoordsList.forEach(([blocker, target]) => {
      this.ctx.moveTo(blocker[0], blocker[1])
      this.ctx.lineTo(target[0], target[1])
      this.ctx.strokeStyle = 'blue'
      this.ctx.stroke()

      console.log(`block start point: (${blocker[0]}, ${blocker[1]})`)
      console.log(`block end point: (${target[0]}, ${target[1]})`)
    })
  }

  render() {
    return <div />
  }

  get lookup() {
    return stateLookups(this.props.game)
  }

  get check() {
    return stateChecks(this.props.game)
  }
}
