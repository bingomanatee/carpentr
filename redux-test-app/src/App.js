import React, { useEffect } from 'react';
import stores from './store';
import './App.css';
import Users from './Users';
import { connect } from 'react-redux';
import { Header, Heading } from 'grommet';
import Log from './Log';

const {
  store, actions, mapStore, mapActions,
} = stores;

const CUsers = connect(mapStore, mapActions)(Users);
const CLog = connect(mapStore, mapActions)(Log);
export default function App() {
  return (
    <div className="App">
      <Header background={{ color: 'brand' }} justify="center">
        <Heading level={2}>
          Carpentr Demo: users and groups
        </Heading>
      </Header>

      <section>
        <CUsers />
        <CLog />
      </section>
    </div>
  );
}
