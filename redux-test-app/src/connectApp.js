import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import camelCase from 'lodash/camelCase';

export default (App, store, actions) => {
  const mapStore = (stateI) => ({ state: stateI });
  const mapActions = (dispatch) => {
    const mergedActions = {};
    Object.keys(actions).forEach((key) => {
      const actionGroup = actions[key];
      const group = {};
      mergedActions[key] = group;

      // blend dispatch into each tier of actions
      Object.keys(actionGroup).forEach((actionName) => {
        const fn = actionGroup[actionName];
        group[camelCase(actionName)] = (...args) => dispatch(fn(...args));
      });
    });
    console.log('merged actions: ', mergedActions);
    return { actions: mergedActions };
  };

  return connect(mapStore, mapActions)(App);
};
