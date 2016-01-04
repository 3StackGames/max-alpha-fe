import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'
import R from 'ramda'

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
        onMouseOver={this.handleCardMouseOver}
        onMouseOut={this.handleCardMouseOut}
        style={this.handStyles}>
        {
          props.combatPair
            ? this.combatPairNode
            : null
        }
        <div className={cx('Card-body', {
          'Card--select': props.selectState,
          'Card--attack': props.attackState,
          'Card--block': props.blockState,
          'Card--tap': props.tapState
        })}>
          <div className='Card-wrap-name'>
            {props.name}
          </div>
          <div className='Card-wrap-tags-overlay' style={{ backgroundImage: `url(${props.imgSrc})` }}>
            {this.tagOverlayNodes}
          </div>
          <div className='Card-wrap-stats'>
            <span className='Card-stat'><label>ATK:</label> {props.attack}</span>
            <span className='Card-stat'><label>HP:</label> {props.health}</span>
          </div>
        </div>
        {
          props.type === 'field'
            ? this.actions
            : null
        }
      </div>
    )
  }

  get handStyles() {
    if (this.props.type === 'hand') {
      return {
        marginLeft: this.props.handLength * -9
      }
    }
  }

  handleCardMouseOver(e) {
    if (this.props.onCardMouseOver) {
      this.props.onCardMouseOver(e)
    }
    this.setState({
      displayActions: true
    })
  }

  handleCardMouseOut(e) {
    if (this.props.onCardMouseOut) {
      this.props.onCardMouseOut(e)
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
      <Mana key={color} color={color} cost={condition[color]} />
    )
  })
  return (
    <span>
      {manaNodes}
    </span>
  )
}

const Mana = ({ color, cost }) => {

  if (color === 'colorless') {
    return (
      <span className={`Mana Mana-${color}`}>{cost}</span>
    )
  }

  const nodes = R.range(0, cost).map(i => {
    return (
      <span key={i} className={`Mana Mana-${'blue'}`}></span>
    )
  })
  return (
    <span>
      {nodes}
    </span>
  )
}
