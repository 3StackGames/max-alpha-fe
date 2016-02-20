import React, { Component, PropTypes, defaultProps } from 'react'
import autobind from 'autobind-decorator'
import { Orb } from '.'

import { DragSource } from 'react-dnd'
const WORKER = 'WORKER'

const workerSource = {
  beginDrag(props, monitor, component) {
    const item = { id: props.id }
    return item
  }
}

const workerConnect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})

@DragSource(WORKER, workerSource, workerConnect)
export default class WorkerOrb extends Component {
  render() {
    return this.props.connectDragSource(
      <span>
        <Orb
          type='worker'
          status={this.orbStatus}
          color={this.props.color}
          interactable={true}
          onClick={this.handleClick}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut} />
      </span>
    )
  }

  get orbStatus() {
    if (this.props.selectState) return 'selected'
    if (this.props.zoomState) return 'loud'
    return 'normal'
  }

  @autobind
  handleClick(e) {
    if (this.props.onOrbClick) {
      this.props.onOrbClick(e, this.props.id)
    }
  }
  
  @autobind
  handleMouseOver(e) {
    if (this.props.onOrbOver) {
      this.props.onOrbOver(e, this.props.id)
    }
  }
  
  @autobind
  handleMouseOut(e) {
    if (this.props.onOrbOut) {
      this.props.onOrbOut(e, this.props.id)
    }
  }
}
