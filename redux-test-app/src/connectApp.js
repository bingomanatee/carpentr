import React from 'react';
import { connect } from 'react-redux';
import camelCase from 'lodash/camelCase';
import { store, actions, mapStore, mapActions } from './store';
import './App.css';

export default (App) => {


  return connect(mapStore, mapActions)(App);
};
