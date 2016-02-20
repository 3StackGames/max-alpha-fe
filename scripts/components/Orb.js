import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import { colors } from '../utils'

const colorTypes = Object.keys(colors).reduce((prev, curr) => {
    prev.push(colors[curr])
    return prev
  }, [])

export default class Orb extends Component {
  static propTypes = {
    value: PropTypes.number,
    type: PropTypes.oneOf(['worker', 'resource', 'costIndicator', 'costSelector']).isRequired,
    status: PropTypes.oneOf(['quiet', 'normal', 'loud', 'selected']),
    color: PropTypes.oneOf(colorTypes),
    interactable: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
  };

  static defaultProps = {
    status: 'normal',
    interactable: true
  };

  render() {
    return <div
      className={cx('Orb', `Orb-${this.props.type}`, `Orb-${this.props.color}`, `Orb--${this.props.status}`, {
        'u-interactable': this.props.interactable
      })}
      onClick={(e) => this.props.onClick && this.props.onClick(e)}
      onMouseOver={(e) => this.props.onMouseOver && this.props.onMouseOver(e)}
      onMouseOut={(e) => this.props.onMouseOut && this.props.onMouseOut(e)}>
      <div>{this.props.value}</div>
    </div>
  }
}
