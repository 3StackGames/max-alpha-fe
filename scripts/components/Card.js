import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'
import R from 'ramda'
import ResourceOrb from './ResourceOrb'

import { DragSource, DropTarget } from 'react-dnd'
const CARD = 'CARD'

const source = {
  beginDrag(props, monitor, component) {
    const item = { id: props.id }
    return item
  }
}

const dragCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})

const target = {
  canDrop(props, monitor, component) {
    const dropperId = monitor.getItem().id
    const { blockableCreatureIds } = props.lookup.card(dropperId)
    return Boolean((blockableCreatureIds || []).find(id => id === props.id))
  },

  drop(props, monitor, component) {
    props.smoothBlockAction(monitor.getItem().id, props.id)
  }
}

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver() && monitor.canDrop()
})

@DropTarget(CARD, target, dropCollect)
@DragSource(CARD, source, dragCollect)
export default class Card extends Component {
  render() {
    const { state, props } = this
    return props.connectDropTarget(props.connectDragSource(
      <div
        className={cx('Card', props.className, {
          'Card-opponent': props.opponent,
          'Card-hand': props.type === 'hand',
          'Card--droppable': props.isOver,
          'Card--blockable': this.isBlockable
        })}
        data-card-id={props.id}
        onClick={this.handleClick}
        onMouseOver={this.handleCardMouseOver}
        onMouseOut={this.handleCardMouseOut}>
        <div
          className={cx('Card-body', {
            'Card-shrink': props.shrink,
            'Card--zoom': props.zoomState,
            'Card--select': props.selectState,
            'Card--attack': props.attackState,
            'Card--block': props.blockState,
            'Card--tap': props.tapState
          })}>
          {
            props.opponent
              ? this.backFaceBody
              : this.frontFaceBody
          }
        </div>
      </div>
    ))
  }

  get backFaceBody() {
    return (
      <div className='Card-back'>
      </div>
    )
  }

  get frontFaceBody() {
    const { props } = this
    return (
      <div>
        <div className='Card-wrap-name'>
          {props.name}
        </div>
        <div className='Card-wrap-tags-overlay'/>
        <div className='Card-wrap-stats'>
          <span className='Card-stat'><label>ATK:</label> {props.currentAttack}</span>
          <span className='Card-stat'><label>HP:</label> {props.currentHealth}</span>
        </div>
      </div>
    )
  }

  get handStyles() {
    if (this.props.type === 'hand') {
      return {
        marginLeft: this.props.handLength * -6
      }
    }
  }

  get isBlockable() {
    const { zoomedCard } = this.props
    if (!zoomedCard) return false

    const { blockableCreatureIds } = this.props.lookup.card(zoomedCard)
    return Boolean((blockableCreatureIds || []).find(id => id === this.props.id))
  }

  @autobind
  handleClick(e) {
    if (this.props.onCardClick) {
      this.props.onCardClick(e, this.props.id)
    }
  }

  @autobind
  handleCardMouseOver(e) {
    if (this.props.onCardMouseOver) {
      this.props.onCardMouseOver(e, this.props.id)
    }
  }

  @autobind
  handleCardMouseOut(e) {
    if (this.props.onCardMouseOut) {
      this.props.onCardMouseOut(e, this.props.id)
    }
  }
}
