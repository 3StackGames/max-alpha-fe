import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'

export default class ResourcePool extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='ResourcePool'>
        <div className='ResourcePool-count-bar'>
          {this.resourceCounts}
        </div>
      </div>
    )
  }

  get resourceCounts() {
    return null
  }
}
