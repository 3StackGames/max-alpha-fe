import React, { Component } from 'react'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import { mount, describeWithDOM } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import { stateLookups, stateChecks } from '../scripts/utils'
import { Town, WorkerOrb } from '../scripts/components'

function wrapInTestContext(ComposedComponent) {
  @DragDropContext(TestBackend)
  class TestContextContainer extends Component {
    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  return TestContextContainer
}

describeWithDOM('<Town/>', () => {
  before(function() {
    this.mockCards = {
      1: { dominantColor: 'WHITE' },
      2: { dominantColor: 'BLACK' },
      3: { dominantColor: 'BLACK' }
    }
    this.mockLookup = {
      card: id => this.mockCards[id],
      self: {
        town: () => [1, 2, 3]
      }
    }
    this.mockUi = {
      zoomedCard: null,
      selectedCard: null
    }
    this.mockPlayer = 'self'
    this.mockUiActs = {
      selectCard: id => {},
      zoomCard: id => {}
    }
    this.mockGame = {
      state: {
        currentPhase: {
          name: 'Main Phase'
        }
      }
    }
    this.mockCheck = stateChecks(this.mockGame)
    this.mockAssignAction = () => {}
    this.TownContext = wrapInTestContext(Town)
  })

  it('renders correct <WorkerOrb /> components', function() {
    const { TownContext } = this
    const wrapper = mount(
      <TownContext
        lookup={this.mockLookup}
        check={this.mockCheck}
        ui={this.mockUi}
        uiActs={this.mockUiActs}
        game={this.mockGame}
        assignAction={this.mockAssignAction}
        player={this.mockPlayer} />
    )

    const orbs = wrapper.find(WorkerOrb).map(n => n) // No idea why mapping makes this work
    const whiteOrbs = orbs.filter(n => n.prop('color') === 'WHITE')
    const blackOrbs = orbs.filter(n => n.prop('color') === 'BLACK')

    expect(orbs).to.have.length(3)
    expect(whiteOrbs).to.have.length(1)
    expect(blackOrbs).to.have.length(2)
  })

  it('renders a `.town-container`', function() {
    const { TownContext } = this
    const wrapper = mount(
      <TownContext
        lookup={this.mockLookup}
        check={this.mockCheck}
        ui={this.mockUi}
        uiActs={this.mockUiActs}
        game={this.mockGame}
        assignAction={this.mockAssignAction}
        player={this.mockPlayer} />
    )
    expect(wrapper.find('.town-container')).to.have.length(1)
  })

  it('renders a `.town-body`', function() {
    const { TownContext } = this
    const wrapper = mount(
      <TownContext
        lookup={this.mockLookup}
        check={this.mockCheck}
        ui={this.mockUi}
        uiActs={this.mockUiActs}
        game={this.mockGame}
        assignAction={this.mockAssignAction}
        player={this.mockPlayer} />
    )
    expect(wrapper.find('.town-body')).to.have.length(1)
  })

  it("selects a worker on click if it's the main phase", function() {
    const { TownContext } = this
    const selectCard = sinon.spy()
    const mockUiActs = {
      ...this.mockUiActs,
      selectCard
    }
    const wrapper = mount(
      <TownContext
        lookup={this.mockLookup}
        check={this.mockCheck}
        ui={this.mockUi}
        uiActs={mockUiActs}
        game={this.mockGame}
        assignAction={this.mockAssignAction}
        player={this.mockPlayer} />
    )
    const orb = wrapper.find(WorkerOrb).map(n => n)[0]
    orb.simulate('click')
    expect(selectCard.calledOnce).to.equal(true)
  })

  it("does not select a worker if it's not the main phase", function() {
    const { TownContext } = this
    const selectCard = sinon.spy()
    const mockUiActs = {
      ...this.mockUiActs,
      selectCard
    }
    const mockGame = {
      ...this.mockGame,
      state: {
        currentPhase: {
          name: 'Not Main Phase'
        }
      }
    }
    const mockCheck = stateChecks(mockGame)
    const wrapper = mount(
      <TownContext
        lookup={this.mockLookup}
        check={mockCheck}
        ui={this.mockUi}
        uiActs={mockUiActs}
        game={mockGame}
        assignAction={this.mockAssignAction}
        player={this.mockPlayer} />
    )
    const orb = wrapper.find(WorkerOrb).map(n => n)[0]
    orb.simulate('click')
    expect(selectCard.calledOnce).to.equal(false)
  })

  // it("zooms a worker on mouse over", () => {

  // })

  // it("unzooms a worker on mouse out", () => {

  // })
})