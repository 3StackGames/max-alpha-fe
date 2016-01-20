import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'
import FaceDownCard from './FaceDownCard'

export default class Grave extends Component {
  static propTypes = {
    lookup: PropTypes.object.isRequired,
    player: PropTypes.oneOf(['self', 'opponent']).isRequired
  };

  render() {
    return (
      <div className='deck-container'>
        <div className='container-label'><span>GRAVE</span></div>
        <div className='deck-body'>
          <div className='deck-placeholder'>
            {this.graveNodes}
          </div>
        </div>
      </div>
    )
  }

  get graveNodes() {
    return this.props.lookup[this.props.player].grave()
      .map((id, i) => (
        <FaceDownCard
          style={{ transform: `translateX(${ i * -0.5 }px)` }}
          key={i}
          type='deck' />
      ))
  }
}