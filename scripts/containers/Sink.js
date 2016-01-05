import React, { Component } from 'react'
import {
  Card,
  Hand,
  ResourcePool
} from '../components'
import R from 'ramda'

let cardModels = [
  {
    name: 'Nomad Scarab',
    imgSrc: 'http://placehold.it/150x100',
    workingColor: 'blue',
    cost: {
      colorless: 1,
      blue: 2
    },
    description: {
      props: [
        'Deathtouch',
        'Quickstrike'
      ],
      tags: [
        {
          condition: { keyword: 'Battlecry' },
          value: 'Win the game.'
        },
        {
          condition: { colorless: 1, white: 3 },
          value: 'Opponent loses the game.'
        }
      ],
      text: [
        'This card comes into play phased out then you win after a bit.',
        'When you die, drink some milk.'
      ]
    },
    attack: 5,
    health: 3
  },
  {
    name: 'Spider Queen',
    imgSrc: 'http://placehold.it/150x100',
    workingColor: 'blue',
    cost: {
      colorless: 1,
      blue: 2
    },
    description: {
      props: [
        'Blocker'
      ],
      tags: [
        {
          condition: { colorless: 2, yellow: 3 },
          value: 'Opponent loses the game.'
        }
      ],
      text: [
        'This card comes into play phased out then you win after a bit.',
        'When you die, drink some milk.'
      ]
    },
    attack: 2,
    health: 8
  },
  {
    name: 'Coal Slave',
    imgSrc: 'http://placehold.it/150x100',
    workingColor: 'colorless',
    cost: {
      colorless: 2,
      blue: 1
    },
    description: {
      props: [
        'Blocker'
      ],
      tags: [
        {
          condition: { colorless: 2, yellow: 3 },
          value: 'Opponent loses the game.'
        }
      ],
      text: [
        'This card comes into play phased out then you win after a bit.',
        'When you die, drink some milk.'
      ]
    },
    attack: 2,
    health: 8
  }
]

const resourceData = {
  resources: {
    colorless: 1,
    white: 2,
    blue: 4
  },
  workers: [
    cardModels[0],
    cardModels[1],
    cardModels[2]
  ]
}

export default class App extends Component {
  render() {

    const assignFields = (fields, obj) => (
      fields.reduce((prev, curr) => {
        prev[curr] = obj[curr]
        return prev
      }, {})
    )

    const card1 = assignFields(
      [
        'name',
        'imgSrc',
        'description',
        'attack',
        'health'
      ],
      cardModels[0]
    )

    const cardWrapperStyles = {
      margin: 15,
      display: 'inline-block'
    }

    const handWrapperStyles = {
      margin: 15,
    }

    const resourcePoolWrapperStyles = {
      margin: 15
    }

    return (
      <div>
        <h1>Yo yo yo, this is the kitchen sink. Enjoy the components!</h1>
        <h4>Field Card</h4>
        <div style={{...cardWrapperStyles}}>
          <p>Standard</p>
          <Card
            type='field'
            {...card1} />
        </div>
        <div style={{...cardWrapperStyles}}>
          <p>Selected</p>
          <Card
            type='field'
            selectState={true}
            {...card1} />
        </div>
        <div style={{...cardWrapperStyles}}>
          <p>Attacker/Attackee</p>
          <Card
            type='field'
            combatPair={cardModels[1].name}
            attackState={true}
            {...card1} />
        </div>
        <div style={{...cardWrapperStyles}}>
          <p>Blocker</p>
          <Card
            type='field'
            combatPair={cardModels[1].name}
            blockState={true}
            {...card1} />
        </div>
        <div style={{...cardWrapperStyles}}>
          <p>Combat Opponent</p>
          <Card
            type='field'
            combatPair={cardModels[1].name}
            blockState={true}
            opponent={true}
            {...card1} />
        </div>
        <div style={{...cardWrapperStyles}}>
          <p>Tapped</p>
          <Card
            type='field'
            tapState={true}
            {...card1} />
        </div>
        <div style={{...handWrapperStyles}}>
          <p>Hand</p>
          <Hand cards={cardModels}/>
        </div>
        <div style={{...resourcePoolWrapperStyles}}>
          <p>Resource Pool</p>
          <ResourcePool {...resourceData}/>
        </div>
      </div>
    )
  }
}
