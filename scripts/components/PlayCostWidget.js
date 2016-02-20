import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import { Orb } from '.'

const PlayCostWidget = ({ cost, paidCost }) => {
  const costOrbs = Object.keys(cost.colors)
    .filter(key => cost.colors[key] > 0)
    .reduce((prev, curr) => {
      R.range(0, cost.colors[curr])
        .forEach(i => prev.push(curr))
      return prev
    }, [])
    .map((color, i) => {
      return <Orb
        key={i}
        type='costIndicator'
        color={color}
        interactable={false} />
    })

  return <div className='PlayCostWidget'>
    <div className='PlayCostWidget-label'>
      Cost:
    </div>
    <div className='PlayCostWidget-selection-group'>
      {costOrbs}
    </div>
  </div>
}

export default PlayCostWidget
