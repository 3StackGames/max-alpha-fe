import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'

import { DropTarget } from 'react-dnd'

const target = {
  canDrop(props, monitor, component) {
    // TODO: Add validation for when you can drop
    return true
  },

  drop(props, monitor, component) {
    const { castle } = props.lookup[props.player].player()
    props.smoothAttackAction(castle.id, monitor.getItem().id)
    props.uiActs.zoomCard(null)
  }
}

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
})

@DropTarget('CARD', target, dropCollect)
export default class Castle extends Component {
  static propTypes = {
    lookup: PropTypes.object.isRequired,
    check: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    uiActs: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    smoothAttackAction: PropTypes.func.isRequired,
    player: PropTypes.oneOf(['self', 'opponent']).isRequired
  };

  render() {
    const { castle } = this.props.lookup[this.props.player].player()
    return this.props.connectDropTarget(
      <div
        className={cx('castle-body', {
          'castle-body--selected': this.props.ui.selectedCard === castle.id
        })}
        onClick={e => this.handleCastleClick(e, castle.id)}>
        {castle.currentHealth}
      </div>
    )
  }

  handleCastleClick(e, id) {
    if (this.props.check.isTargetable(id)) {
      this.props.uiActs.selectCard(id)
    }
  }
}