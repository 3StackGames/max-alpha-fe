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
      selecting: {}
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
          key={i}
          type='hand'
          opponent={this.props.opponent}
          handLength={this.props.cards.length}
          selectState={this.state.selecting[card.id]}
          onCardMouseOver={this.handleCardMouseOver}
          onCardMouseOut={this.handleCardMouseOut}
          onCardClick={this.handleCardClick}
          {...card} />
      )
    })
  }

  handleCardClick(e, id) {
    this.props.uiActs.selectCard(id)
  }

  handleCardMouseOver(e, id) {
    this.props.uiActs.zoomCard(id)
    this.state.selecting[id] = true
    this.setState({
      selecting: this.state.selecting
    })
  }

  handleCardMouseOut(e, id) {
    this.props.uiActs.zoomCard(null)
    this.state.selecting[id] = false
    this.setState({
      selecting: this.state.selecting
    })
  }
}
