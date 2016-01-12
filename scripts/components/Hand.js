import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import Card from './Card'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

@autobind
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selecting: {}
    }
  }

  static PropTypes = {
    ui: PropTypes.object.isRequired,
    onCardClick: PropTypes.func.isRequired,
    onCardMouseOver: PropTypes.func.isRequired,
    onCardMouseOut: PropTypes.func.isRequired
  };

  render() {
    return (
      <ReactCSSTransitionGroup
        component='div'
        className='Hand'
        transitionName='card-hand'
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        {this.cardNodes}
      </ReactCSSTransitionGroup>
    )
  }

  get cardNodes() {
    return this.props.cards.map(card => {
      return (
        <Card
          key={card.id}
          type='hand'
          opponent={this.props.opponent}
          handLength={this.props.cards.length}
          zoomState={this.props.ui.zoomedCard === card.id}
          selectState={this.props.ui.selectedCard === card.id}
          onCardMouseOver={this.props.onCardMouseOver}
          onCardMouseOut={this.props.onCardMouseOut}
          onCardClick={this.props.onCardClick}
          {...card} />
      )
    })
  }
}
