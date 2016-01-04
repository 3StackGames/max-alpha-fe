import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import Card from './Card'

@autobind
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selecting: Array(this.props.cards.length).fill(false)
    }
  }

  render() {
    return (
      <div className='Hand'>
        {this.cardNodes}
      </div>
    )
  }

  get cardNodes() {
    return this.props.cards.map((card, i) => {
      return (
        <Card
          ref={`card-${i}`}
          key={i}
          type='hand'
          handLength={this.props.cards.length}
          selectState={this.state.selecting[i]}
          onCardMouseOver={this.cardMouseOver.bind(this, i)}
          onCardMouseOut={this.cardMouseOut.bind(this, i)}
          {...card} />
      )
    })
  }

  cardMouseOver(i, e) {
    this.state.selecting[i] = true
    this.setState({
      selecting: this.state.selecting
    })
  }

  cardMouseOut(i, e) {
    this.state.selecting[i] = false
    this.setState({
      selecting: this.state.selecting
    })
  }
}
