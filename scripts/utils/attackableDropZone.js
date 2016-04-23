import React, { Component } from 'react'

export default function AttackableDropZoneDecorator(ComposedComponent) {
  return class extends Component {
    render() {
      return <ComposedComponent {...this.props} isAttackable={this.isAttackable} />
    }

    get isAttackable() {
      const { zoomedCard } = this.props.ui
      if (!zoomedCard) return false

      const { attackableStructureIds } = this.props.lookup.card(zoomedCard)
      // return attackableStructureIds.find(id => )
    }
  }
}
