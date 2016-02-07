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
    return true
  },

  drop(props, monitor, component) {
    props.smoothBlockAction(monitor.getItem().id, props.id)
  }
}

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
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
          'Card-hand': props.type === 'hand'
        })}
        onClick={this.handleClick}
        onMouseOver={this.handleCardMouseOver}
        onMouseOut={this.handleCardMouseOut}>
        {
          props.combatPair
            ? this.combatPairNode
            : null
        }
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
          <span className='Card-stat'><label>ATK:</label> {props.attack}</span>
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

  // get actions() {
  //   return (
  //     <div className={cx('Card-actions-wrap', {
  //       active: this.state.displayActions
  //     })}>
  //       <div className='Card-action'>
  //         Use Effect
  //       </div>
  //     </div>
  //   )
  // }

  get description() {
    const { props, tags, text } = this.props.description
    const tagNodes = tags.map((tag, i) => (
      <Tag key={i} condition={tag.condition} value={tag.value} />
    ))
    return (
      <div>
        <span>{props.join(', ')}</span>
        {tagNodes}
        <p>{text}</p>
      </div>
    )
  }

  // Need to remake with the game state
  // get tagOverlayNodes() {
  //   const { tags } = this.props.abilities
  //   // get only the first two tags
  //   const tagKeyNodes = R.take(2, tags)
  //     .map((tag, i) => {
  //       return (
  //         <div key={i} className='Card-overlay-tag'>
  //           <TagKey condition={tag.condition} />
  //         </div>
  //       )
  //     })
  //   return (
  //     <div className='Card-tags-overlay'>
  //       {tagKeyNodes}
  //       {
  //         tags.length > 2
  //           ? <div style={{textAlign: 'center'}}>...</div>
  //           : null
  //       }
  //     </div>
  //   )
  // }

  get combatPairNode() {
    return (
      <div className='Card-combat-pair'>
        {this.props.combatPair}
      </div>
    )
  }
}

const Tag = ({ condition, value }) => {
  return (
    <div>
      <TagKey condition={condition} />: <span>{value}</span>
    </div>
  )
}

const TagKey = ({ condition }) => {
  if (condition.keyword) {
    return (
      <span className='Card-tag'>{condition.keyword}</span>
    )
  }

  const manaNodes = Object.keys(condition).map(color => {
    return (
      <ResourceOrb key={color} color={color} cost={condition[color]} />
    )
  })
  return (
    <span>
      {manaNodes}
    </span>
  )
}
