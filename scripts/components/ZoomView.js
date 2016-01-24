import React, { Component, PropTypes, defaultProps } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import cx from 'classname'
import { ResourceOrb } from '.'

export default class ZoomView extends Component {
  render() {
    return (
      <div className={cx('zoom-container', {
        'zoom-container--zoomed': this.props.ui.zoomedCard
      })}>
        <div className='zoom-body'>
          {this.zoomNode}
        </div>
      </div>
    )
  }

  get zoomNode() {
    const { zoomedCard } = this.props.ui
    if (!zoomedCard) return

    const card = this.props.lookup.card(zoomedCard)
    const costNodes = Object.keys(card.currentCost.colors)
      .filter(color => card.currentCost.colors[color] > 0)
      .map(color => (
        <ResourceOrb
          key={color}
          color={color}
          value={card.currentCost.colors[color]} />
      ))

    return [
      <div key={0} className='zoom-image-group group'>
        <img className='zoom-image' src='http://placehold.it/200x200'/>
      </div>,
      <div key={1} className='zoom-info-group group'>
        <div className='zoom-name'>{card.name}</div>
        <div className='zoom-cost'>{costNodes}</div>
        <div className='zoom-stats-group group'>
          <div className='zoom-attack'>ATK: {card.attack || 0}</div>
          <div className='zoom-health'>HP: {card.currentHealth}/{card.health}</div>
        </div>
      </div>,
      <div key={2} className='zoom-effects-group group'>
        <div className='zoom-effect'>Some effects... :)</div>
      </div>
    ]
  }
}