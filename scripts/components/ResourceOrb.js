import React from 'react'
import cx from 'classname'
import R from 'ramda'
import { keys } from '../utils'

const ResourceOrb = ({ color, value }) => {
  return (
    <span
      className={cx(`ResourceOrb ResourceOrb-${color.toLowerCase()}`, {
        'ResourceOrb--empty': value === 0
      })}>
      {value}
    </span>
  )

  // if (color === keys.COLORLESS) {
  //   return (
  //     <span className={`Mana Mana-${color.toLowerCase()}`}>{cost}</span>
  //   )
  // }

  // const nodes = R.range(0, cost).map(i => {
  //   return (
  //     <span key={i} className={`Mana Mana-${'blue'}`}></span>
  //   )
  // })
  // return (
  //   <span>
  //     {nodes}
  //   </span>
  // )
}

export default ResourceOrb
