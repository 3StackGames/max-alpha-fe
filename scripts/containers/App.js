import React, { Component } from 'react'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import {
  Canvas
} from '.'


@DragDropContext(HTML5Backend)
export default class App extends Component {
  render() {
    return (
      <div>
        {this.props.children}
        <Canvas />
      </div>
    )
  }
}
