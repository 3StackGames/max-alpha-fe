import React, { Component } from 'react'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import { mount, describeWithDOM } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import { stateLookups, stateChecks } from '../scripts/utils'
import { Field } from '../scripts/components'

function wrapInTestContext(ComposedComponent) {
  @DragDropContext(TestBackend)
  class TestContextContainer extends Component {
    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  return TestContextContainer
}

describeWithDOM('<Field/>', () => {
  before(function() {

  })

  it('renders a `field-container`', function() {
    expect(true).to.equal(false)
  })

  it('renders a `field-body`', function() {
    expect(true).to.equal(false)
  })
})
