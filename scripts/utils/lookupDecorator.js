import React, { Component } from 'react'
import R from 'ramda'

export function lookupDecorator(ComposedComponent) {

  ComposedComponent.prototype.lookup = function lookup() {

    
  }

  return ComposedComponent
}
