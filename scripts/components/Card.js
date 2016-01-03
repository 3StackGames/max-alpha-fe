import React, { Component, PropTypes, defaultProps } from 'react'
import R from 'ramda'

export default class Card extends Component {
  static defaultProps = {
    name: 'Nomad Scarab',
    imgSrc: 'http://placehold.it/150x100',
    description: {
      props: [
        'Deathtouch',
        'Quickstrike'
      ],
      tags: [
        {
          condition: { keyword: 'Battlecry' },
          value: 'Win the game.'
        },
        {
          condition: { colorless: 1, white: 3 },
          value: 'Opponent loses the game.'
        }
      ],
      text: [
        'This card comes into play phased out then you win after a bit.',
        'When you die, drink some milk.'
      ]
    },
    attack: 5,
    health: 3
  }

  render() {
    const { props } = this
    return (
      <div className='Card'>
        <div className='Card-wrap-name'>
          {props.name}
        </div>
        <div className='Card-wrap-tags-overlay' style={{ backgroundImage: `url(${props.imgSrc})` }}>
          {this.tagOverlayNodes}
        </div>
        {/*<div className='Card-wrap-description'>
          {this.description}
        </div> */}
        <div className='Card-wrap-stats'>
          <span className='Card-stat'><label>ATK:</label> {props.attack}</span>
          <span className='Card-stat'><label>HP:</label> {props.health}</span>
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
