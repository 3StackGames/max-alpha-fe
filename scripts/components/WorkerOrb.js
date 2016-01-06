import React from 'react'
import cx from 'classname'

const WorkerOrb = ({
  id,
  color,
  onOrbClick,
  onOrbOver,
  onOrbOut,
  zoomState,
  selectState }) => {
  const handleClick = e => {
    if (onOrbClick) onOrbClick(e, id)
  }

  const handleMouseOver = e => {
    if (onOrbOver) onOrbOver(e, id)
  }

  const handleMouseOut = e => {
    if (onOrbOut) onOrbOut(e, id)
  }
  return (
    <span
      className={cx(
        'WorkerOrb',
        'ResourceOrb',
        `ResourceOrb-${color.toLowerCase()}`, {
        'WorkerOrb--zoom': zoomState,
        'WorkerOrb--select': selectState
      })}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut} />
  )
}

export default WorkerOrb