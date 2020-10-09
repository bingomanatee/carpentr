import React, { PureComponent } from 'react';

export default class CarpentrListener extends PureComponent {
  componentWillUnmount() {
    if (this._sub) {
      this._sub();
    }
  }

  componentDidMount() {
    this._dispatch = this.props.store.dispatch;
    this.actions = this.props.actions;
    this._sub = this.props.store.subscribe(() => {
      const value = this.props.store.getState();
      // console.log('state value: ', value);
    }, (err) => {
      console.log('state error: ', err);
    });
  }

  render() {
    return this.props.children;
  }
}
