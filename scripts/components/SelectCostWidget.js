import React, { Component, PropTypes, defaultProps } from 'react'
import autobind from 'autobind-decorator'
import { colors } from '../utils'
import { Orb } from '.'

export default class SelectCostWidget extends Component {
  constructor(props) {
    super(props)

    this.remainingColorValues = this.calculateRemaining(props.cost, props.paidCost)
    console.log(this.remainingColorValues)
  }

  componentWillReceiveProps(nextProps) {
    this.remainingColorValues = this.calculateRemaining(nextProps.cost.colors, nextProps.paidCost.colors)
    console.log(this.remainingColorValues)
  }

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

  calculateRemaining(cost, paidColors) {
    const paidColorsCopy = {...paidColors}
    return Object.keys(paidColorsCopy)
      .reduce((prev, curr) => {
        if (paidColorsCopy[curr] > 0) {
          paidColorsCopy[curr]--
          if (prev[curr] > 0) {
            prev[curr]--
          } else if (prev[colors.COLORLESS] > 0) {
            prev[colors.COLORLESS]--
          }
        }
        return prev
      }, {...cost})
  }

  isAccepting(color) {
    // console.log('PAID COPY: ', paidCostCopy.colors)
    // console.log('PAID: ', this.props.paidCost.colors)
    // console.log('COST: ', this.props.cost.colors)
    // console.log('REMAINING: ', remainingColorValues)

    return this.remainingColorValues[color] > 0
      || this.remainingColorValues[colors.COLORLESS] > 0
  }

  canPay(color) {
    console.log('vvvvvvv vvvvvvv')
    console.log(color)
    console.log('accepting? ', this.isAccepting(color))
    console.log('have? ', this.props.paidCost.colors[color] < this.props.colorResources[color])
    console.log('^^^^^^^ ^^^^^^^')
    return this.isAccepting(color) && this.props.paidCost.colors[color] < this.props.colorResources[color]
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

// const SelectCostWidget = ({ cost, paidCost, colorResources, assignCost }) => {
//   const paidCostCopy = {...paidCost}
//   const remainingColorValues = Object.keys(paidCostCopy.colors)
//     .reduce((prev, curr) => {
//       if (paidCostCopy.colors[curr] > 0) {
//         paidCostCopy.colors[curr]--
//         if (prev[curr] > 0) {
//           prev[curr]--
//         } else if (prev[colors.COLORLESS] > 0) {
//           prev[colors.COLORLESS]--
//         }
//       }
//       return prev
//     }, {...cost.colors})

//   const isAccepting = color => {
//     return remainingColorValues[color] > 0
//       || remainingColorValues[colors.COLORLESS] > 0
//   }

//   const canPay = color => {
//     console.log('vvvvvvv vvvvvvv')
//     console.log(color)
//     console.log(isAccepting(color))
//     console.log(paidCost.colors[color] < colorResources[color])
//     console.log('^^^^^^^ ^^^^^^^')
//     return isAccepting(color) && paidCost.colors[color] < colorResources[color]
//   }

//   const orbStatus = color => {
//     if (!canPay(color)) return 'quiet'
//     return 'normal'
//   }

//   const handleClick = (e, color) => {
//     // if (!canPay(color)) return
//     // const modifier = e.shiftKey ? -1 : 1
//     console.log(paidCost.colors[color] + 1)
//     assignCost(color, paidCost.colors[color] + 1)
//   }

//   // console.log('PAID: ', paidCost.colors)
//   // console.log('COST: ', cost.colors)
//   // console.log('REMAINING: ', remainingColorValues)
//   return <div className='SelectCostWidget u-flex u-flex-center'>
//     <button onClick={e => handleClick(e, 'COLORLESS')}>
//       {paidCost.colors['COLORLESS']}
//     </button>
//   </div>
// }

// export default SelectCostWidget


// {
//   Object.keys(colorResources)
//     .filter(color => colorResources[color] > 0)
//     .map((color, i) => {
//       return <Orb
//         key={i}
//         value={paidCost.colors[color]}
//         color={color}
//         type='costSelector'
//         onClick={handleClick(color)} />
//     })
// }

