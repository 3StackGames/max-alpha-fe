import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'

export default class Courtyard extends Component {
  static propTypes = {
    lookup: PropTypes.object.isRequired,
    check: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    uiActs: PropTypes.object.isRequired,
    player: PropTypes.oneOf(['self', 'opponent']).isRequired
  };

  render() {
    return(
      <div className='courtyard-structure'>
        {this.courtyardNodes}
      </div>
    )
  }

  get courtyardNodes() {
    return this.props.lookup[this.props.player].courtyard()
      .map(id => this.props.lookup.card(id))
      .map(struct => {
        return (
          <div
            className={cx('courtyard-card', {
              'courtyard-card--selected': this.props.ui.selectedCard === struct.id
            })}
            onClick={e => this.handleClick(e, struct.id)}
            onMouseOver={e => this.handleMouseOver(e, struct.id)}
            onMouseOut={e => this.handleMouseOut(e, struct.id)}>
            <div>Name: {struct.name}</div>
            <div>HP: {struct.currentHealth}</div>
          </div>
        )
      })
  }

  @autobind
  handleClick(e, id) {
    if (this.props.check.isTargetable(id)) {
      this.props.uiActs.selectedCard(id)
    }
  }

  @autobind
  handleMouseOver(e, id) {
    if (this.props.check.inLocation('self', 'courtyard', id)) {
      this.props.uiActs.zoomCard(id)
    }
  }

  @autobind
  handleMouseOut(e, id) {
    if (this.props.check.inLocation('self', 'courtyard', id)) {
      this.props.uiActs.zoomCard(null)
    }
  }
}