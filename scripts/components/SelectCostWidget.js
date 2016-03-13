import React, { Component, PropTypes, defaultProps } from 'react'
import autobind from 'autobind-decorator'
import { colors } from '../utils'
import { Orb } from '.'

export default class SelectCostWidget extends Component {
  render() {
    return <div className='SelectCostWidget u-flex u-flex-center'>
      {
        Object.keys(this.props.colorResources)
          .filter(color => this.props.colorResources[color] > 0)
          .map((color, i) => {
            return <Orb
              key={i}
              value={this.props.paidCost.colors[color]}
              color={color}
              status={this.orbStatus(color)}
              type='costSelector'
              onClick={e => this.handleClick(e, color)} />
          })
      }
    </div>
  }

  canPay(color) {
    return this.props.paidCost.colors[color] < this.props.colorResources[color]
  }

  orbStatus(color) {
    if (!this.canPay(color)) return 'quiet'
    return 'normal'
  }

  @autobind
  handleClick(e, color) {
    if (!e.shiftKey && !this.canPay(color)) return
    if (e.shiftKey && this.props.paidCost.colors[color] <= 0) return
    const modifier = e.shiftKey ? -1 : 1
    this.props.assignCost(color, this.props.paidCost.colors[color] + modifier)
  }
}
