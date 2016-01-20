import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'
import ResourceOrb from './ResourceOrb'

export default class ResourceIndicator extends Component {
  static propTypes = {
    lookup: PropTypes.object.isRequired,
    player: PropTypes.oneOf(['self', 'opponent'])
  };

  render() {
    return (
      <div className='resource-indicator-container'>
        <div className='resource-indicator-body'>
          <div className='resource-row'>
            {this.resourceNode('WHITE')}
            {this.resourceNode('BLUE')}
          </div>
          <div className='resource-row'>
            {this.resourceNode('YELLOW')}
            {this.resourceNode('COLORLESS')}
            {this.resourceNode('GREEN')}
          </div>
          <div className='resource-row'>
            {this.resourceNode('RED')}
            {this.resourceNode('BLACK')}
          </div>
        </div>
      </div>
    )
  }

  resourceNode(color) {
    return (
      <ResourceOrb
        color={color}
        value={this.props.lookup[this.props.player].player().resources.colors[color]} />
    )
  }
}