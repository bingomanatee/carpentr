import React, { PureComponent } from 'react';

import { requestsToActions, handleUsers } from './carpenterProcesses';

export default class CarpentrListener extends PureComponent {

  process() {
    console.log('---------- respondingToChange: ----------');
    requestsToActions(this.props.state.changes, this.props.actions);
  }

  componentDidMount() {
    handleUsers(this.props);
    this.process();
  }

  componentDidUpdate() {
    this.process();
  }

  render() {
    return this.props.children;
  }
}
