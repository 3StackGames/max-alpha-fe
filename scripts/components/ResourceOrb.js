import React from 'react'
import R from 'ramda'

const ManaOrb = ({ color, cost }) => {

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

export default ManaOrb
