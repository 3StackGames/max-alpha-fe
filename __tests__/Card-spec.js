import React, { Component } from 'react'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import { mount, describeWithDOM } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import { stateLookups, stateChecks } from '../scripts/utils'
import { Card } from '../scripts/components'

function wrapInTestContext(ComposedComponent) {
  @DragDropContext(TestBackend)
  class TestContextContainer extends Component {
    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  return TestContextContainer
}

describeWithDOM('<Card/>', () => {
  before(function() {

  })

  it("can drag if it's attack phase, is your turn, card can attack, and card is on the field", function() {
    expect(true).to.equal(false)
  })

  it("can drag if it's block phase, is opponent's turn, card isn't exhausted, and card is on the field", function() {
    expect(true).to.equal(false)
  })

  it("can't drag on invalid game states", function() {
    expect(true).to.equal(false)
  })
})