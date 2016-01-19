export const bindStateDecorator = engine => component => {
  const cwm = component.prototype.componentWillMount
  const cwu = component.prototype.componentWillUnmount

  component.prototype.componentWillMount = function() {
    engine.addStateListener(this.bindState)
    if (cwm) cwm.call(this)
  }

  component.prototype.componentWillUnmount = function() {
    engine.removeStateListener(this.bindState)
    if (cwu) cwu.call(this)
  }
}