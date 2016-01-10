import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'

const FaceDownCard = ({
  id,
  style,
  type,
  onCardClick,
  onCardMouseOver,
  onCardMouseOut
}) => (
  <div
    style={style}
    className={cx('FaceDownCard', {
      'FaceDownCard-deck': type === 'deck',
      'FaceDownCard-hand': type === 'hand'
    })}>
  </div>
)

export default FaceDownCard