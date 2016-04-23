import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'
import { DropTarget } from 'react-dnd'
import { phases } from '../utils'

const target = {
  canDrop(props, monitor, component) {
    // TODO: Add validation for when you can drop
    return true
  },

  drop(props, monitor, component) {
    const { castle } = props.lookup[props.player].player()
    props.smoothAttackAction(monitor.getItem().id, castle.id)
    props.uiActs.zoomCard(null)
  }
}

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
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
    return this.props.connectDropTarget(
      <div
        className={cx('castle-body', 'droppable-area', {
          'castle-body--selected': this.props.ui.selectedCard === this.castle.id,
          'droppable-area--over': this.props.isOver,
          'droppable-area--attackable': this.isAttackable
        })}
        data-card-id={this.castle.id}
        onClick={e => this.handleCastleClick(e, this.castle.id)}>
        {this.castle.currentHealth}
      </div>
    )
  }

  handleCastleClick(e, id) {
    if (this.props.check.isTargetable(id)) {
      this.props.uiActs.selectCard(id)
    }
  }

  get castle() {
    return this.props.lookup[this.props.player].player().castle
  }

  get isAttackable() {
    const { zoomedCard } = this.props.ui
    if (!zoomedCard) return false

    const { attackableStructureIds } = this.props.lookup.card(zoomedCard)
    return Boolean((attackableStructureIds || []).find(id => id === this.castle.id))
  }
}
