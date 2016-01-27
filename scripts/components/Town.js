import React, { Component, PropTypes, defaultProps } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import cx from 'classname'
import autobind from 'autobind-decorator'
import WorkerOrb from './WorkerOrb'
import { DropTarget } from 'react-dnd'
import { phases } from '../utils'

const target = {
  canDrop(props, monitor) {
    return props.lookup.self.hand().find(id => id === monitor.getItem().id)
  },

  drop(props, monitor, component) {
    props.uiActs.selectCard(monitor.getItem().id)
    props.assignAction()
    props.uiActs.zoomCard(null)
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
})

@DropTarget('CARD', target, collect)
export default class Town extends Component {
  static propTypes = {
    lookup: PropTypes.object.isRequired,
    check: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    uiActs: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    assignAction: PropTypes.func.isRequired,
    player: PropTypes.oneOf(['self', 'opponent']).isRequired
  };

  render() {
    return this.props.connectDropTarget(
      <div className='town-container'>
        <ReactCSSTransitionGroup
          component='div'
          className='town-body'
          transitionName='town-resource'
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}>
          {this.workerNodes}
        </ReactCSSTransitionGroup>
      </div>
    )
  }

  get workerNodes() {
    return this.props.lookup[this.props.player].town()
      .map((id, i) => {
        const color = this.props.lookup.card(id).dominantColor
        return (
          <WorkerOrb
            key={i}
            id={id}
            color={color}
            zoomState={this.props.ui.zoomedCard === id}
            selectState={this.props.ui.selectedCard === id}
            onOrbClick={this.handleWorkerClick}
            onOrbOver={this.handleWorkerMouseOver}
            onOrbOut={this.handleWorkerMouseOut} />
        )
      })
  }

  @autobind
  handleWorkerClick(e, id) {
    if (this.props.check.isPhase(phases.MAIN)) {
      this.props.uiActs.selectCard(id)
    }
  }

  @autobind
  handleWorkerMouseOver(e, id) {
    this.props.uiActs.zoomCard(id)
  }

  @autobind
  handleWorkerMouseOut(e, id) {
    this.props.uiActs.zoomCard(null)
  }
}
