import React, { Component, PropTypes } from 'react'
import ReactDOM, { render } from 'react-dom'
import cx from 'classname'
import autobind from 'autobind-decorator'
import Card from './Card'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { DropTarget } from 'react-dnd'
import { phases } from '../utils'

const target = {
  canDrop(props, monitor) {
    return props.check.inLocation(props.player, 'hand', monitor.getItem().id)
  },

  drop(props, monitor, component) {
    props.uiActs.selectCard(monitor.getItem().id)
    props.uiActs.declarePlayCard(monitor.getItem().id)
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver() && monitor.canDrop()
})

@DropTarget(['CARD', 'STRUCTURE'], target, collect)
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
    return this.props.connectDropTarget(
      <div className={cx('field-container', 'droppable-area', {
        'droppable-area--over': this.props.isOver
      })}>
        <ReactCSSTransitionGroup
          component='div'
          className='field-body'
          transitionName='creature'
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}>
          {this.creatureNodes}
        </ReactCSSTransitionGroup>
      </div>
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
          tapState={card.exhausted}
          onCardClick={this.handleCardClick}
          onCardMouseOver={this.handleCardMouseOver}
          onCardMouseOut={this.handleCardMouseOut}
          smoothBlockAction={this.props.smoothBlockAction}
          selectAbility={this.props.uiActs.selectAbility}
          player={this.props.player}
          {...card} />
      ))
  }

  @autobind
  handleCardClick(e, id) {
    const { check, uiActs } = this.props

    if (check.promptExists) {
      if (check.isTargetable(id)) {
        uiActs.selectCard(id)
      }
      return
    }

    if (
      check.isPhase(phases.MAIN)
      && check.isTurn('self')
    ) {
      uiActs.selectCard(id)
    }

    if (
      check.isPhase(phases.ATTACK)
      && check.isTurn('self')
    ) {
      uiActs.selectCard(id)
    }

    if (
      check.isPhase(phases.BLOCK)
      && check.isTurn('opponent')
      && check.inLocation('self', 'creatures', id)
    ) {
      uiActs.selectCard(id)
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
