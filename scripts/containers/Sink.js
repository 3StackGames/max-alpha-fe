import React, { Component } from 'react'
import {
  Card
} from '../components'

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>Yo yo yo, this is the kitchen sink. Enjoy the components!</h1>
        <h4>Card</h4>
        <Card />
        <h4>Field Card</h4>
        <Card type='field' tapped={false} />
      </div>
    )
  }
}
