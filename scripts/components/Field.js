import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import Card from './Card'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { DropTarget } from 'react-dnd'

export default class Field extends Component {
  static propTypes = {
    lookup: PropTypes.object.isRequired,
    check: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    uiActs: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    player: PropTypes.oneOf(['self', 'opponent']).isRequired
  };

  render() {
    return (
      <ReactCSSTransitionGroup
        component='div'
        className='field-container'
        transitionName='creature'
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}>
        {this.creatureNodes}
      </ReactCSSTransitionGroup>
    )
  }

  get creatureNodes() {
    const creatures = this.props.lookup[this.props.player].creatures()
    return creatures
      .map(id => this.props.lookup.card(id))
      .map((card, i) => (
        <Card
          key={i}
          shrink={creatures.length > 6}
          type='field'
          id={card.id}
          zoomState={this.props.ui.zoomedCard === card.id}
          selectState={this.props.ui.selectedCard === card.id}
          onCardClick={this.handleCardClick}
          onCardMouseOver={this.handleCardMouseOver}
          onCardMouseOut={this.handleCardMouseOut}
          smoothBlockAction={this.props.smoothBlockAction}
          {...card} />
      ))
  }

  @autobind
  handleCardClick(e, id) {
    const { check, uiActs } = this.props
    if (
      check.isPhase('Attack Phase')
      && check.isTurn('self')
    ) {
      uiActs.selectCard(id)
    }

    if (
      check.isPhase('Block Phase')
      && check.isTurn('opponent')
    ) {
      if (
        !check.queueExists
        && check.inLocation('self', 'creatures', id)
      ) {
        uiActs.selectCard(id)
      }

      if (
        check.queueExists
        && check.isTargetable(id)
      ) {
        uiActs.selectCard(id)
      }
    }
  }

  @autobind
  handleCardMouseOver(e, id) {
    this.props.uiActs.zoomCard(id)
  }

  @autobind
  handleCardMouseOut(e, id) {
    this.props.uiActs.zoomCard(null)
  }
}