import React, { Component, PropTypes, defaultProps } from 'react'
import cx from 'classname'
import autobind from 'autobind-decorator'

export default class StructureDeck extends Component {
  static propTypes = {
    lookup: PropTypes.object.isRequired,
    check: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    uiActs: PropTypes.object.isRequired,
    player: PropTypes.oneOf(['self', 'opponent'])
  };

  render() {
    return (
      <div className='structures-container'>
        <div className='container-label'><span>STRUCTS</span></div>
        <div className='structures-body'>
          {this.structureNodes}
        </div>
      </div>
    )
  }

  get structureNodes() {
    return this.props.lookup[this.props.player].structures()
      .map(id => this.props.lookup.card(id))
      .map(struct => {
        const { id, name } = struct
        return (
          <div
            key={id}
            className={cx('struct-deck-item', {
              'struct-deck-item--selected': this.props.ui.selectedCard === id
            })}
            onClick={e => this.handleClick(e, id)}
            onMouseOver={e => this.handleMouseOver(e, id)}
            onMouseOut={e => this.handleMouseOut(e, id)}>
           {name}
          </div>
        )
      })
  }
  
  @autobind
  handleClick(e, id) {
    const { check, uiActs } = this.props
    if (
      check.isPhase('Main Phase')
      && check.inLocation('self', 'structures', id)
    ) {
      uiActs.selectCard(id)
    }
  }

  @autobind
  handleMouseOver(e, id) {
    if (this.props.check.inLocation('self', 'structures', id)) {
      this.props.uiActs.zoomCard(id)
    }
  }

  @autobind
  handleMouseOut(e, id) {
    if (this.props.check.inLocation('self', 'structures', id)) {
      this.props.uiActs.zoomCard(null)
    }
  }
}