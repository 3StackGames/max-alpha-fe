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
    console.log('try to drop')
    return props.lookup.self.town().find(id => id === monitor.getItem().id)
  },

  drop(props, monitor, component) {
    props.uiActs.selectCard(monitor.getItem().id)
    props.pullAction()
    props.uiActs.zoomCard(null)
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
})

@DropTarget('WORKER', target, collect)
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selecting: {}
    }
  }

  static propTypes = {
    lookup: PropTypes.object.isRequired,
    check: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    uiActs: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    pullAction: PropTypes.func.isRequired,
    player: PropTypes.oneOf(['self', 'opponent']).isRequired
  };

  render() {
    return this.props.connectDropTarget(
      <div className='hand-container'>
        <ReactCSSTransitionGroup
          component='div'
          className='Hand'
          transitionName='card-hand'
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}>
          {this.cardNodes}
        </ReactCSSTransitionGroup>
      </div>
    )
  }

  get cardNodes() {
    const cards = this.props.lookup
      [this.props.player]
      .hand()
      .map(id => this.props.lookup.card(id))
    return cards.map(card => {
      return (
        <Card
          key={card.id}
          type='hand'
          opponent={this.props.player === 'opponent'}
          handLength={cards.length}
          zoomState={this.props.ui.zoomedCard === card.id}
          selectState={this.props.ui.selectedCard === card.id}
          onCardClick={this.handleCardClick}
          onCardMouseOver={this.handleCardMouseOver}
          onCardMouseOut={this.handleCardMouseOut}
          {...card} />
      )
    })
  }

  @autobind
  handleCardClick(e, id) {
    if (
      this.props.check.isPhase(phases.MAIN)
      && this.props.check.isTurn('self')
      && this.props.check.inLocation('self', 'hand', id)
    ) {
      this.props.uiActs.selectCard(id)
    }
  }

  @autobind
  handleCardMouseOver(e, id) {
    if (this.props.check.inLocation('self', 'hand', id)) {
      this.props.uiActs.zoomCard(id)
    }
  }

  @autobind
  handleCardMouseOut(e, id) {
    if (this.props.check.inLocation('self', 'hand', id)) {
      this.props.uiActs.zoomCard(null)
    }
  }
}
