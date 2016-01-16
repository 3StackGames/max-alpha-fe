import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'

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
      <span
        className={cx(
          'WorkerOrb',
          'ResourceOrb',
          `ResourceOrb-${this.props.color}`, {
          'WorkerOrb--zoom': this.props.zoomState,
          'WorkerOrb--select': this.props.selectState
        })}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut} />
    )
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
