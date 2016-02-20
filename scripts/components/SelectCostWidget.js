import React, { Component, PropTypes, defaultProps } from 'react'
import { colors } from '../utils'
import { Orb } from '.'

const SelectCostWidget = ({ cost, paidCost, colorResources, assignCost }) => {
  const paidCostCopy = {...paidCost}
  const remainingColorValues = Object.keys(paidCostCopy.colors)
    .reduce((prev, curr) => {
      if (paidCostCopy.colors[curr] > 0) {
        paidCostCopy.colors[curr]--
        if (prev[curr] > 0) {
          prev[curr]--
        } else if (prev[colors.COLORLESS] > 0) {
          prev[colors.COLORLESS]--
        }
      }
      return prev
    }, {...cost.colors})

  const isAccepting = color => {
    return remainingColorValues[color] > 0
      || remainingColorValues[colors.COLORLESS] > 0
  }

  const canPay = color => {
    console.log('vvvvvvv vvvvvvv')
    console.log(color)
    console.log(isAccepting(color))
    console.log(paidCost.colors[color] < colorResources[color])
    console.log('^^^^^^^ ^^^^^^^')
    return isAccepting(color) && paidCost.colors[color] < colorResources[color]
  }

  const orbStatus = color => {
    if (!canPay(color)) return 'quiet'
    return 'normal'
  }

  const handleClick = color => e => {
    // if (!canPay(color)) return
    // const modifier = e.shiftKey ? -1 : 1
    console.log(paidCost.colors[color] + 1)
    assignCost(color, (paidCost.colors[color]) + 1)
  }

  // console.log('PAID: ', paidCost.colors)
  // console.log('COST: ', cost.colors)
  // console.log('REMAINING: ', remainingColorValues)
  return <div className='SelectCostWidget u-flex u-flex-center'>
    <div onClick={handleClick('COLORLESS')}>
      {paidCost.colors['COLORLESS']}
    </div>
  </div>
}

export default SelectCostWidget


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

