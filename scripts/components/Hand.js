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
          zoomState={this.props.ui.zoomedCard === card.id}
          selectState={this.props.ui.selectedCard === card.id}
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
  }

  handleCardMouseOut(e, id) {
    this.props.uiActs.zoomCard(null)
  }
}
