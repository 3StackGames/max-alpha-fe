import React from 'react'
import { Orb } from '.'

const ResourceOrb = ({ color, value }) => {

  const orbStatus = () => {
    if (value === 0) return 'quiet'
    return 'normal'
  }

  return <Orb
    value={value}
    type='resource'
    status={orbStatus()}
    color={color}
    interactable={false} />
}

export default ResourceOrb
