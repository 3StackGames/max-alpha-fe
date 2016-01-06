import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'
import R from 'ramda'
import ResourceOrb from './ResourceOrb'

@autobind
export default class Card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayActions: false
    }
  }
  render() {
    const { state, props } = this
    return (
      <div className={cx('Card', props.className, {
        'Card-opponent': props.opponent
      })}
        onClick={this.handleClick}
        onMouseOver={this.handleCardMouseOver}
        onMouseOut={this.handleCardMouseOut}
        style={this.handStyles}>
        {
          props.combatPair
            ? this.combatPairNode
            : null
        }
        <div className={cx('Card-body', {
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
        {
          props.type === 'field'
            ? this.actions
            : null
        }
      </div>
    )
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
        <div className='Card-wrap-tags-overlay'>
          {/*{this.tagOverlayNodes}*/}
        </div>
        <div className='Card-wrap-stats'>
          <span className='Card-stat'><label>ATK:</label> {props.attack}</span>
          <span className='Card-stat'><label>HP:</label> {props.health}</span>
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

  handleClick(e) {
    if (this.props.onCardClick) {
      this.props.onCardClick(e, this.props.id)
    }
  }

  handleCardMouseOver(e) {
    if (this.props.onCardMouseOver) {
      this.props.onCardMouseOver(e, this.props.id)
    }

    this.setState({
      displayActions: true
    })
  }

  handleCardMouseOut(e) {
    if (this.props.onCardMouseOut) {
      this.props.onCardMouseOut(e, this.props.id)
    }
    this.setState({
      displayActions: false
    })
  }

  get actions() {
    return (
      <div className={cx('Card-actions-wrap', {
        active: this.state.displayActions
      })}>
        <div className='Card-action'>
          Use Effect
        </div>
      </div>
    )
  }

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
  get tagOverlayNodes() {
    const { tags } = this.props.description
    // get only the first two tags
    const tagKeyNodes = R.take(2, tags)
      .map((tag, i) => {
        return (
          <div key={i} className='Card-overlay-tag'>
            <TagKey condition={tag.condition} />
          </div>
        )
      })
    return (
      <div className='Card-tags-overlay'>
        {tagKeyNodes}
        {
          tags.length > 2
            ? <div style={{textAlign: 'center'}}>...</div>
            : null
        }
      </div>
    )
  }

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
